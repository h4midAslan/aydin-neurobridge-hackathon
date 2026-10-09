"""
Synthetic mobile-data-usage generator for the tariff recommender.

Draws users from 10 hidden usage types (never exposed to the model as a
feature -- saved separately, for evaluation only). Produces:
  - telecom_users.csv          (train, no persona/type column)
  - telecom_users_persona.csv  (train + persona column, filled in later
                                 by the clustering step in pipeline.py)
  - telecom_users_hidden_types.csv (train user_id -> hidden_type, eval only)
  - test_same_dist.csv         (2000 users, same generator, different seed)
  - test_drift_x1.3.csv        (2000 users, usage scaled by 1.3x)

Columns (16): user_id, social_media_gb, tiktok_gb, instagram_gb,
video_streaming_gb, youtube_gb, netflix_gb, communication_gb, whatsapp_gb,
collaboration_gb, teams_gb, ai_apps_gb, chatgpt_gb, claude_gb, gemini_gb,
gaming_gb.

Invariant: each section >= sum of its listed sub-apps (the remainder is
"other apps in that section" usage not individually tracked). All totals
are capped at 85 GB / 30 days.
"""

import numpy as np
import pandas as pd

HIDDEN_TYPES = [
    "light",
    "heavy_streamer",
    "tiktok_instagram",
    "gamer",
    "remote_worker",
    "ai_heavy",
    "whatsapp_heavy",
    "netflix_heavy",
    "youtube_family",
    "general",
]

# Per-type lognormal mean (GB) for each section before app-split and cap.
# Format: section -> (mean, sigma) for the lognormal draw.
PROFILES = {
    "light": dict(social=1.0, video=1.0, comm=0.5, collab=0.1, ai=0.1, gaming=0.2, sigma=0.5),
    "heavy_streamer": dict(social=3.0, video=22.0, comm=1.5, collab=0.3, ai=0.3, gaming=1.0, sigma=0.5),
    "tiktok_instagram": dict(social=11.0, video=3.0, comm=1.5, collab=0.2, ai=0.2, gaming=0.5, sigma=0.45),
    "gamer": dict(social=2.0, video=3.0, comm=1.0, collab=0.2, ai=0.3, gaming=48.0, sigma=0.5),
    "remote_worker": dict(social=1.5, video=2.5, comm=3.0, collab=9.0, ai=1.5, gaming=0.3, sigma=0.5),
    "ai_heavy": dict(social=2.0, video=3.0, comm=1.5, collab=1.5, ai=18.0, gaming=0.3, sigma=0.5),
    "whatsapp_heavy": dict(social=1.5, video=1.5, comm=7.0, collab=0.3, ai=0.2, gaming=0.3, sigma=0.5),
    "netflix_heavy": dict(social=2.0, video=20.0, comm=1.5, collab=0.3, ai=0.2, gaming=0.5, sigma=0.5),
    "youtube_family": dict(social=3.0, video=24.0, comm=2.0, collab=0.3, ai=0.2, gaming=1.0, sigma=0.55),
    "general": dict(social=4.0, video=5.0, comm=3.0, collab=1.5, ai=1.0, gaming=2.0, sigma=0.5),
}

TOTAL_CAP_GB = 85.0


def _lognormal(rng: np.random.Generator, mean: float, sigma: float, n: int) -> np.ndarray:
    if mean <= 0:
        return np.zeros(n)
    mu = np.log(mean) - 0.5 * sigma**2
    return rng.lognormal(mu, sigma, n)


def generate(n_users: int, seed: int, scale: float = 1.0, start_id: int = 1) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    type_choice = rng.choice(HIDDEN_TYPES, size=n_users)

    rows = []
    for i in range(n_users):
        t = type_choice[i]
        p = PROFILES[t]
        sigma = p["sigma"]

        social = _lognormal(rng, p["social"] * scale, sigma, 1)[0]
        video = _lognormal(rng, p["video"] * scale, sigma, 1)[0]
        comm = _lognormal(rng, p["comm"] * scale, sigma, 1)[0]
        collab = _lognormal(rng, p["collab"] * scale, sigma, 1)[0]
        ai = _lognormal(rng, p["ai"] * scale, sigma, 1)[0]
        gaming = _lognormal(rng, p["gaming"] * scale, sigma, 1)[0]

        # app split within each section (sub-apps sum to <= section total)
        if t == "tiktok_instagram":
            # split this hidden type into two latent sub-modes so both a
            # TikTok-dominant and an Instagram-dominant persona can be
            # discovered by clustering, instead of one blended blob.
            tiktok_share = rng.uniform(0.75, 0.92) if rng.random() < 0.5 else rng.uniform(0.08, 0.25)
        else:
            tiktok_share = rng.uniform(0.35, 0.65)
        tiktok = social * tiktok_share * rng.uniform(0.8, 1.0)
        instagram = social * (1 - tiktok_share) * rng.uniform(0.6, 0.9)

        if t == "netflix_heavy":
            youtube_share = rng.uniform(0.08, 0.28)
        elif t == "youtube_family":
            youtube_share = rng.uniform(0.72, 0.92)
        else:
            youtube_share = rng.uniform(0.4, 0.7)
        youtube = video * youtube_share * rng.uniform(0.8, 1.0)
        netflix = video * (1 - youtube_share) * rng.uniform(0.6, 0.9)

        whatsapp = comm * rng.uniform(0.7, 0.95)
        teams = collab * rng.uniform(0.6, 0.9)

        chatgpt_share = rng.uniform(0.3, 0.6)
        claude_share = rng.uniform(0.2, 0.5) * (1 - chatgpt_share)
        chatgpt = ai * chatgpt_share
        claude = ai * claude_share
        gemini = ai * max(0.0, (1 - chatgpt_share - claude_share)) * rng.uniform(0.5, 0.9)

        row = dict(
            social_media_gb=social,
            tiktok_gb=tiktok,
            instagram_gb=instagram,
            video_streaming_gb=video,
            youtube_gb=youtube,
            netflix_gb=netflix,
            communication_gb=comm,
            whatsapp_gb=whatsapp,
            collaboration_gb=collab,
            teams_gb=teams,
            ai_apps_gb=ai,
            chatgpt_gb=chatgpt,
            claude_gb=claude,
            gemini_gb=gemini,
            gaming_gb=gaming,
        )
        rows.append((t, row))

    df = pd.DataFrame([r for _, r in rows])
    hidden = pd.Series([t for t, _ in rows], name="hidden_type")

    total = (
        df["social_media_gb"]
        + df["video_streaming_gb"]
        + df["communication_gb"]
        + df["collaboration_gb"]
        + df["ai_apps_gb"]
        + df["gaming_gb"]
    )
    scale_down = np.minimum(1.0, TOTAL_CAP_GB / total.replace(0, 1.0))
    for c in df.columns:
        df[c] = (df[c] * scale_down).round(3)

    df.insert(0, "user_id", np.arange(start_id, start_id + n_users))
    df["hidden_type"] = hidden.values
    return df


def main():
    train = generate(5000, seed=42, start_id=1)
    test_same = generate(2000, seed=1337, start_id=100001)
    test_drift = generate(2000, seed=2026, scale=1.3, start_id=200001)

    hidden_train = train[["user_id", "hidden_type"]].copy()
    train_no_type = train.drop(columns=["hidden_type"])
    test_same_no_type = test_same.drop(columns=["hidden_type"])
    test_drift_no_type = test_drift.drop(columns=["hidden_type"])

    hidden_test_same = test_same[["user_id", "hidden_type"]].copy()
    hidden_test_drift = test_drift[["user_id", "hidden_type"]].copy()

    train_no_type.to_csv("telecom_users.csv", index=False)
    hidden_train.to_csv("telecom_users_hidden_types.csv", index=False)
    test_same_no_type.to_csv("test_same_dist.csv", index=False)
    hidden_test_same.to_csv("test_same_dist_hidden_types.csv", index=False)
    test_drift_no_type.to_csv("test_drift_x1.3.csv", index=False)
    hidden_test_drift.to_csv("test_drift_x1.3_hidden_types.csv", index=False)

    print("Generated:")
    print(f"  telecom_users.csv: {len(train_no_type)} rows")
    print(f"  test_same_dist.csv: {len(test_same_no_type)} rows")
    print(f"  test_drift_x1.3.csv: {len(test_drift_no_type)} rows")
    print("\nHidden type distribution (train):")
    print(hidden_train["hidden_type"].value_counts())
    print("\nTotal GB summary (train):")
    total_gb = train_no_type[
        ["social_media_gb", "video_streaming_gb", "communication_gb", "collaboration_gb", "ai_apps_gb", "gaming_gb"]
    ].sum(axis=1)
    print(total_gb.describe())


if __name__ == "__main__":
    main()
