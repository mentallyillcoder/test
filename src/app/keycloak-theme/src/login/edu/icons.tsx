/* Icon nét mảnh theo phong cách icon trong Design System (viền 2px, bo tròn). */

const base = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
};

export function IconPlay() {
    return (
        <svg {...base} stroke="none" fill="currentColor">
            <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
        </svg>
    );
}

export function IconFlashcard() {
    return (
        <svg {...base} stroke="none" fill="currentColor">
            <rect x="3" y="4" width="18" height="16" rx="3.5" />
            <rect x="7" y="9" width="10" height="1.8" rx="0.9" fill="#fff" />
            <rect x="7" y="13.2" width="10" height="1.8" rx="0.9" fill="#fff" />
        </svg>
    );
}

export function IconChart() {
    return (
        <svg {...base} stroke="none" fill="currentColor">
            <rect x="3.5" y="13" width="4" height="7.5" rx="1.5" />
            <rect x="10" y="9" width="4" height="11.5" rx="1.5" />
            <rect x="16.5" y="4" width="4" height="16.5" rx="1.5" />
        </svg>
    );
}

export function IconMail() {
    return (
        <svg {...base}>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}

export function IconLock() {
    return (
        <svg {...base}>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            <path d="M12 14.5v2" />
        </svg>
    );
}

export function IconUser() {
    return (
        <svg {...base}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}

export function IconEye() {
    return (
        <svg {...base}>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export function IconEyeOff() {
    return (
        <svg {...base}>
            <path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1" />
            <path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.9 9.9 0 0 0 5.4-1.6" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            <path d="m3 3 18 18" />
        </svg>
    );
}

export function IconAlert() {
    return (
        <svg {...base} className="edu-alert-icon">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5" />
            <path d="M12 16.2v.3" />
        </svg>
    );
}
