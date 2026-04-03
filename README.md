<div align="center">

# 🚀 GitWrapped

![GitWrapped Hero Banner](public/assets/hero.png)

### **Experience your GitHub stats like a cinematic masterpiece.**

[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.2.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.38.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

**GitWrapped** transforms your year of code into a 7-chapter cinematic journey. Built for developers who value aesthetics as much as results.

[The Chapters](#-the-cinematic-chapters) • [Power Logic](#-how-power-is-calculated) • [Features](#-project-features)

</div>

---

## 🎬 The Cinematic Chapters

Your story is told through seven streamlined scenes:

1. 📊 **Stats Overview**: Your total Repos, PRs, and Issues at a glance.
2. ⚡ **Power Archetype**: Your developer tier and class based on coding performance.
3. 🧬 **Coding DNA**: A breakdown of your commit habits and temporal patterns.
4. 🔥 **Contribution Heatmap**: A high-fidelity visualization of your yearly activity.
5. 🌠 **Community Impact**: Your stars, forks, and ecosystem reach.
6. 🏆 **Achievements**: Special milestones and badges unlocked during the year.
7. 🆔 **Digital Identity**: A final summary card ready for social sharing.

---

## ⚡ How Power is Calculated

Your **Power Level** isn't just a number—it's a weighted score based on your real-world impact over the last 365 days.

| Metric | Weight | Description |
| :--- | :--- | :--- |
| **Pull Requests** | `3.0x` | High-impact collaborative contributions. |
| **Repository Stars** | `5.0x` | Community validation and project reach. |
| **Commits** | `1.2x` | Foundation of your steady development work. |
| **Issues** | `1.5x` | Involvement in project management and bug fixing. |
| **Longest Streak** | `2.0x` | Dedication and daily coding consistency. |

> [!TIP]
> **Total Score** = `(Commits * 1.2) + (PRs * 3) + (Issues * 1.5) + (Total Stars * 5) + (Max Streak * 2)`

---

## 🔥 Project Features

| Feature | Description |
| :--- | :--- |
| **⚔️ Code Battle** | Compare stats with fellow developers in a real-time showdown. |
| **📊 Interactive Analytics** | High-fidelity charts and heatmaps that turn raw activity into visual stories. |
| **📸 One-Click Export** | Export your identity card as a high-quality image for social sharing. |
| **🔐 Private Stats** | Optional GitHub OAuth to include your private repository data in your recap. |

---

## 🛠️ Deployment & Setup (Cloudflare)

To enable Private Data authorization, you must configure a GitHub OAuth App and set the following environment variables:

1. **GitHub OAuth App**: Create one in [Developer Settings](https://github.com/settings/developers).
   - **Authorization callback URL**: `https://your-domain.pages.dev/api/auth/callback`
2. **Environment Variables**:
   - `GITHUB_CLIENT_ID`: Your OAuth Client ID.
   - `GITHUB_CLIENT_SECRET`: Your OAuth Client Secret.
   - `GITHUB_TOKEN`: Your personal fallback token for public stats.

---

<div align="center">

### **Ready to see your wrapped?**

Crafted with ❤️ by **[KalpakPS](https://github.com/KalpakPS)**


</div>
