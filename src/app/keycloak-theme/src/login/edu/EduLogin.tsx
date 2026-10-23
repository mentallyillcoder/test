import { useState, type FormEvent } from "react";
import type { KcContext } from "../KcContext";
import EduLayout from "./EduLayout";
import EduField from "./EduField";
import { IconLock, IconMail } from "./icons";

type Props = {
    kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
};

export default function EduLogin(props: Props) {
    const { kcContext } = props;
    const { realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const serverError = messagesPerField.existsError("username", "password") ? messagesPerField.getFirstError("username", "password") : undefined;

    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const usernameLabel = !realm.loginWithEmailAllowed ? "Tên đăng nhập" : realm.registrationEmailAsUsername ? "Email" : "Email hoặc tên đăng nhập";

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const username = (form.elements.namedItem("username") as HTMLInputElement | null)?.value.trim() ?? "";
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        const next: typeof errors = {};
        if (!usernameHidden && username === "") next.username = `Vui lòng nhập ${usernameLabel.toLowerCase()}.`;
        if (password === "") next.password = "Vui lòng nhập mật khẩu.";

        setErrors(next);
        if (Object.keys(next).length !== 0) {
            e.preventDefault();
            return;
        }
        setIsSubmitting(true);
    };

    const showRegister = realm.password && realm.registrationAllowed && !registrationDisabled;

    return (
        <EduLayout
            kcContext={kcContext}
            documentTitle="Đăng nhập | EduRecall"
            title="Đăng nhập"
            subtitle="Chào mừng bạn trở lại với EduRecall"
            displayMessage={serverError === undefined}
            footer={
                showRegister ? (
                    <>
                        Chưa có tài khoản?{" "}
                        <a className="edu-link-strong" href={url.registrationUrl}>
                            Đăng ký ngay
                        </a>
                    </>
                ) : undefined
            }
        >
            {realm.password && (
                <form className="edu-form" action={url.loginAction} method="post" onSubmit={onSubmit} noValidate>
                    {usernameHidden ? (
                        <p className="edu-attempted">
                            Đăng nhập với <strong>{auth.attemptedUsername}</strong>{" "}
                            <a className="edu-link" href={url.loginRestartFlowUrl}>
                                Đổi tài khoản
                            </a>
                        </p>
                    ) : (
                        <EduField
                            id="username"
                            name="username"
                            label={usernameLabel}
                            icon={<IconMail />}
                            type="text"
                            inputMode="email"
                            placeholder="Nhập email của bạn"
                            defaultValue={login.username ?? ""}
                            autoComplete="username"
                            autoFocus
                            error={errors.username ?? serverError}
                        />
                    )}

                    <EduField
                        id="password"
                        name="password"
                        label="Mật khẩu"
                        icon={<IconLock />}
                        isPassword
                        placeholder="Nhập mật khẩu của bạn"
                        autoComplete="current-password"
                        autoFocus={usernameHidden}
                        error={errors.password ?? (usernameHidden ? serverError : undefined)}
                    />

                    {((realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed) && (
                        <div className="edu-options">
                            {realm.rememberMe && !usernameHidden && (
                                <label className="edu-check">
                                    <input type="checkbox" name="rememberMe" defaultChecked={!!login.rememberMe} /> Ghi nhớ đăng nhập
                                </label>
                            )}
                            {realm.resetPasswordAllowed && (
                                <a className="edu-link edu-forgot" href={url.loginResetCredentialsUrl}>
                                    Quên mật khẩu?
                                </a>
                            )}
                        </div>
                    )}

                    <input type="hidden" name="credentialId" value={auth.selectedCredential ?? ""} />
                    <button className="edu-button" type="submit" name="login" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            )}
        </EduLayout>
    );
}
