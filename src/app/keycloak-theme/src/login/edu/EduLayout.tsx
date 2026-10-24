import { useEffect, type ReactNode } from "react";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import logoUrl from "./assets/logo.png";
import { IconAlert, IconChart, IconFlashcard, IconPlay } from "./icons";

import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./edu.css";

type Props = {
    kcContext: KcContext;
    /** Tiêu đề tab trình duyệt */
    documentTitle: string;
    title: string;
    subtitle: string;
    /** Hiện thông báo chung (kcContext.message) phía trên form */
    displayMessage: boolean;
    children: ReactNode;
    /** Dòng cuối form, ví dụ "Chưa có tài khoản? Đăng ký ngay" */
    footer?: ReactNode;
};

const FEATURES = [
    { Icon: IconPlay, title: "Khóa học chất lượng", desc: "Video bài giảng và kiểm tra theo lộ trình" },
    { Icon: IconFlashcard, title: "Flashcard cá nhân", desc: "Tự tạo và ôn tập theo cách của bạn" },
    { Icon: IconChart, title: "Theo dõi tiến độ", desc: "Biết rõ mình đã học được bao nhiêu" }
];

export default function EduLayout(props: Props) {
    const { kcContext, documentTitle, title, subtitle, displayMessage, children, footer } = props;
    const { message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle;
        document.documentElement.lang = "vi";
    }, [documentTitle]);

    // Giữ các script mặc định của Keycloak (kiểm tra phiên đăng nhập ở tab khác...).
    // doUseDefaultCss = false nên không nạp CSS PatternFly của Keycloak.
    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

    if (!isReadyToRender) {
        return null;
    }

    const showMessage = displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);

    return (
        <div className="edu-page">
            <main className="edu-card">
                <section className="edu-hero" aria-label="Giới thiệu EduRecall">
                    <img className="edu-logo" src={logoUrl} alt="EduRecall" />
                    <h1 className="edu-hero-title">
                        Học hiệu quả hơn <br />
                        mỗi ngày
                    </h1>
                    <p className="edu-hero-desc">
                        Nền tảng học trực tuyến tích hợp bài giảng, kiểm tra và flashcard cá nhân giúp bạn ghi nhớ kiến thức lâu hơn.
                    </p>
                    <ul className="edu-features">
                        {FEATURES.map(({ Icon, title, desc }) => (
                            <li key={title} className="edu-feature">
                                <span className="edu-feature-icon" aria-hidden="true">
                                    <Icon />
                                </span>
                                <span>
                                    <span className="edu-feature-title">{title}</span>
                                    <span className="edu-feature-desc">{desc}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="edu-hero-art" aria-hidden="true" />
                </section>

                <section className="edu-panel">
                    <div className="edu-panel-inner">
                        <h2 className="edu-title">{title}</h2>
                        <p className="edu-subtitle">{subtitle}</p>

                        {showMessage && (
                            <div className={`edu-alert edu-alert-${message.type}`} role="alert">
                                <IconAlert />
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </div>
                        )}

                        {children}

                        {footer !== undefined && <p className="edu-footer">{footer}</p>}
                    </div>
                </section>
            </main>
        </div>
    );
}
