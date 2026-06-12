export const personalInfo = {
  name: "Maxime Michet",
  email: "michet.maxime@gmail.com",
  github: "https://github.com/max01110",
  linkedin: "https://www.linkedin.com/in/max-michet/",
  googleScholar: "#",
  cv: "/cv.pdf",
};

export const subtitles = [
  "Robotics Researcher",
  "AI & Computer Vision",
  "MASc Student, UTIAS",
];

export const bio = `Hi, I'm Max! I'm a M.A.Sc. student at the [University of Toronto Robotics and AI Laboratory (TRAIL)](https://www.trailab.utias.utoronto.ca/) with [Prof. Steven Waslander](https://www.trailab.utias.utoronto.ca/steven-waslander), part of the [University of Toronto Robotics Institute](https://robotics.utoronto.ca/) and [UTIAS](https://www.utias.utoronto.ca/), and an Affiliate Researcher at the [Vector Institute](https://vectorinstitute.ai/).

My research is broadly focused on 3D perception for autonomous robots and vehicles. I'm interested in building robust, scalable systems that work reliably in the real world.

Previously, I worked at [MDA Space](https://mda.space/) on the Canadarm3 robotic arm for NASA's Artemis program. I've also worked on various research projects, including transformer-based visual odometry and autonomous drone racing.`;

export const affiliations = [
  { name: "TRAIL Lab, UTIAS", role: "Master's Student (MASc)", url: "https://www.trailab.utias.utoronto.ca/" },
  { name: "University of Toronto", role: "MASc in Robotics and AI", url: "https://www.utias.utoronto.ca/" },
  { name: "Vector Institute", role: "Affiliate Researcher", url: "https://vectorinstitute.ai/" },
];

export const education: EducationEntry[] = [
  {
    university: "University of Toronto",
    department: "Institute for Aerospace Studies (UTIAS)",
    departmentUrl: "https://www.utias.utoronto.ca/",
    location: "Toronto, Canada",
    degree: "Master of Applied Science (MASc)",
    specialization: "Robotics and AI",
    supervisor: "Professor Steven Waslander",
    supervisorUrl: "https://www.trailab.utias.utoronto.ca/steven-waslander",
    lab: "Toronto Robotics and AI Laboratory (TRAIL)",
    labUrl: "https://www.trailab.utias.utoronto.ca/",
    period: "September 2026 – Present",
    current: true,
  },
  {
    university: "University of Toronto",
    location: "Toronto, Canada",
    degree: "Bachelor of Applied Science in Engineering Science",
    specialization: "Aerospace Engineering + PEY Co-op",
    minor: "Mechatronics and Robotics",
    period: "September 2021 – June 2026",
    coursework: [
      "Mobile Robotics & Perception",
      "Robot Modeling & Control",
      "Spacecraft Dynamics & Control",
      "Space Systems Design",
      "Control Systems",
      "Scientific Computing",
    ],
  },
];

export interface EducationEntry {
  university: string;
  department?: string;
  departmentUrl?: string;
  location: string;
  degree: string;
  specialization: string;
  minor?: string;
  supervisor?: string;
  supervisorUrl?: string;
  lab?: string;
  labUrl?: string;
  affiliations?: { name: string; url: string; role: string }[];
  period: string;
  current?: boolean;
  coursework?: string[];
}

export const publications: Publication[] = [
  {
    id: "C.1",
    year: 2024,
    type: "Conference",
    title: "Time Optimal Gate Traversing Planner for Autonomous Drone Racing",
    authors: [
      { name: "M. Michet", highlight: true },
      { name: "et al.", highlight: false },
    ],
    venue: "IEEE International Conference on Robotics and Automation (ICRA)",
    location: "Yokohama, Japan",
    award: "Best Paper on UAVs at ICRA 2024",
    abstract:
      "A time-optimal planning approach for autonomous drone racing that outperforms state-of-the-art results in planning time for computing optimal trajectories through drone race tracks.",
    thumbnail: "/images/projects/totg_fig.png?v=1",
    links: {
      pdf: "#",
      arxiv: "https://arxiv.org/abs/2309.06837",
    },
  },
  {
    id: "C.2",
    year: 2024,
    type: "Conference",
    title:
      "Beyond the Visible: Jointly Attending to Spectral and Spatial Dimensions with HSI-Diffusion for the FINCH Spacecraft",
    authors: [{ name: "UTAT Space Systems (group authorship)", highlight: false }],
    venue: "Small Satellite Conference",
    location: "Logan, Utah",
    abstract:
      "A hyperspectral image denoising framework leveraging diffusion models, designed for the FINCH CubeSat spacecraft's hyperspectral imaging payload.",
    thumbnail: "/images/projects/hsi_diff.jpeg",
    links: {
      pdf: "#",
      arxiv: "https://arxiv.org/abs/2406.10724",
    },
  },
  {
    id: "C.3",
    year: 2022,
    type: "Conference",
    title: "FINCH: A Blueprint for Accessible and Scientifically Valuable Remote Sensing Missions",
    authors: [{ name: "UTAT Space Systems (group authorship)", highlight: false }],
    venue: "Small Satellite Conference",
    location: "Logan, Utah",
    abstract:
      "A comprehensive mission design paper for the FINCH 3U CubeSat, presenting an accessible framework for scientifically valuable remote sensing missions.",
    thumbnail: "/images/projects/utat.png",
    links: {
      pdf: "https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=5247&context=smallsat",
    },
  },
];

export const projects: Project[] = [
  {
    title: "Transformer-Based Visual Odometry",
    lab: "TRAIL – Toronto Robotics and AI Laboratory",
    period: "Sept 2025 – Present",
    description:
      "BASc undergraduate thesis. Investigated transformer-based monocular visual odometry, integrating geometric priors into learning-based architectures.",
    details:
      "Improved performance of state-of-the-art transformer-based VO models by incorporating pretrained depth through cross-attention mechanisms. Investigated the use of transformer models as a pose refinement step in classical VO pipelines.",
    gradient: "from-violet-500/45 to-cyan-500/45",
  },
  {
    title: "3D Anomaly Detection",
    lab: "TRAIL – Toronto Robotics and AI Laboratory",
    period: "May 2025 – Sept 2025",
    description:
      "Contributed to 3D anomaly detection research through improved segmentation models and novel data augmentation pipelines for LiDAR-image data.",
    details:
      "Improved segmentation models through 2D-3D consistency constraints and architecture upgrades. Developed a pipeline to augment anomaly object detection datasets by injecting anomalies into paired LiDAR-image data. Extended the ALLO (anomaly localization in lunar orbit) pipeline to support 3D data via depth map generation and voxel grids.",
    gradient: "from-cyan-500/45 to-emerald-500/45",
  },
  {
    title: "Inject3D",
    lab: "TRAIL – Toronto Robotics and AI Laboratory",
    period: "2025",
    description:
      "A data augmentation pipeline that injected geometrically consistent 3D objects from Objaverse into paired LiDAR and camera scenes for anomaly detection research.",
    details:
      "Built an end-to-end pipeline using Blender to render and composite random 3D meshes into real-world driving scenes. Uses RANSAC ground-plane fitting, collision and occlusion checks, and IoU verification to ensure spatially consistent placements. Augments both the camera image and the LiDAR point cloud with labeled anomaly points. Supports KITTI and custom datasets with batch processing and Docker deployment.",
    thumbnail: "/images/projects/inject3d.png",
    gradient: "from-rose-500/45 to-amber-500/45",
  },
  {
    title: "Autonomous Drone Racing",
    lab: "Flight Systems and Control Laboratory",
    period: "May 2023 – Sept 2023",
    description:
      "Built a complete autonomous drone racing platform integrating visual-inertial localization and flight control.",
    details:
      "Optimized visual-inertial localization achieving 4x speedup in feature matching via point/line-based tracking, validated through real-world tests. Contributed to the development of a time-optimal drone racing planner that outperformed state-of-the-art results. Published at IEEE ICRA 2024 (Best Paper on UAVs).",
    thumbnail: "/images/projects/drones.jpg",
    gradient: "from-orange-500/45 to-rose-500/45",
  },
  {
    title: "FINCH CubeSat Mission",
    lab: "University of Toronto Aerospace Team (UTAT)",
    period: "Sept 2021 – Sept 2024",
    description:
      "Led the mission operations team (20+ members) for FINCH, a 3U CubeSat hyperspectral mission launching in 2027.",
    details:
      "Developed spacecraft and ground modes, command architecture, and oversaw ground station development. Performed mission simulations in STK for operations planning, thermal and radiation verification. Initiated fault detection, isolation, and recovery (FDIR) efforts for system-level error analysis. Co-authored two papers at the Small Satellite Conference.",
    thumbnail: "/images/projects/utat.png",
    gradient: "from-blue-500/45 to-indigo-500/45",
  },
  {
    title: "Digital Image Correlation & 3D Printing",
    lab: "Decisionics Laboratory",
    period: "May 2022 – Sept 2022",
    description:
      "Developed a novel 3D printing algorithm achieving 1.5x vertical strength increase and built an in-house DIC system for non-contact strain measurement.",
    details:
      "Created a novel 3D printing algorithm for FDM printers via GCode modifications, achieving 1.5x vertical strength increase over traditional methods. Built an in-house digital image correlation (DIC) system used to measure strain and deformations of printed parts in a non-contact manner.",
    thumbnail: "/images/projects/dic.jpg",
    gradient: "from-emerald-500/45 to-teal-500/45",
  },
];

export interface Publication {
  id: string;
  year: number;
  type: string;
  title: string;
  authors: { name: string; highlight: boolean }[];
  venue: string;
  location: string;
  award?: string;
  abstract: string;
  thumbnail?: string;
  links: {
    pdf?: string;
    arxiv?: string;
    code?: string;
    video?: string;
  };
}

export interface Project {
  title: string;
  lab: string;
  period: string;
  description: string;
  details: string;
  thumbnail?: string;
  gradient: string;
}
