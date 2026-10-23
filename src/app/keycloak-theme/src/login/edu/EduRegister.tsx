import { useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import type { KcContext } from "../KcContext";
import EduLayout from "./EduLayout";
import EduField from "./EduField";
import { IconLock, IconMail, IconUser } from "./icons";

type Props = {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
};

type Errors = Partial<Record<"fullName" | "email" | "password" | "passwordConfirm" | "terms", string>>;

/**
 * Tách "Nguyễn Văn An" thành lastName = "Nguyễn Văn", firstName = "An".
 * Trả về undefined nếu chưa đủ 2 chữ.
 */
function splitFullName(fullName: string): { firstName: string; lastName: string } | undefined {
    const words = fullName.trim().split(/\s+/).filter(w => w !== "");
    if (words.length < 2) return undefined;
    return { firstName: words[words.length - 1], lastName: words.slice(0, -1).join(" ") };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EduRegister(props: Props) {
    const { kcContext } = props;
    const { url, messagesPerField, profile, passwordRequired, termsAcceptanceRequired } = kcContext;

    const attr = profile.attributesByName;
    const initialFullName = [attr.lastName?.value, attr.firstName?.value].filter(v => v !== undefined && v !== "").join(" ");
    // Khi realm KHÔNG dùng email làm username, Keycloak vẫn đòi trường username: gửi kèm bằng chính email.
    const needsUsername = attr.username !== undefined;

    const [names, setNames] = useState({ firstName: attr.firstName?.value ?? "", lastName: attr.lastName?.value ?? "" });
    const [email, setEmail] = useState(attr.email?.value ?? "");
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const serverError = (fieldName: string, ...otherFieldNames: string[]) =>
        messagesPerField.existsError(fieldName, ...otherFieldNames) ? messagesPerField.getFirstError(fieldName, ...otherFieldNames) : undefined;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
        const fullName = (form.querySelector("#fullName") as HTMLInputElement).value;

        const next: Errors = {};
        const split = splitFullName(fullName);
        if (split === undefined) next.fullName = "Vui lòng nhập đầy đủ họ và tên.";
        if (value("email").trim() === "") next.email = "Vui lòng nhập email.";
        else if (!EMAIL_PATTERN.test(value("email").trim())) next.email = "Email không hợp lệ.";
        if (passwordRequired) {
            if (value("password") === "") next.password = "Vui lòng nhập mật khẩu.";
            if (value("password-confirm") !== value("password")) next.passwordConfirm = "Mật khẩu nhập lại không khớp.";
        }
        if (termsAcceptanceRequired && !(form.elements.namedItem("termsAccepted") as HTMLInputElement).checked) {
            next.terms = "Vui lòng đồng ý với điều khoản sử dụng.";
        }

        setErrors(next);
        if (Object.keys(next).length !== 0 || split === undefined) {
            e.preventDefault();
            return;
        }

        // flushSync: cập nhật 2 ô ẩn firstName/lastName ngay lập tức,
        // trước khi trình duyệt gửi form đi.
        flushSync(() => {
            setNames(split);
            setIsSubmitting(true);
        });
    };

    return (
        <EduLayout
            kcContext={kcContext}
            documentTitle="Đăng ký | EduRecall"
            title="Tạo tài khoản"
            subtitle="Bắt đầu hành trình học tập cùng EduRecall"
            displayMessage={messagesPerField.exists("global")}
            footer={
                <>
                    Đã có tài khoản?{" "}
                    <a className="edu-link-strong" href={url.loginUrl}>
                        Đăng nhập
                    </a>
                </>
            }
        >
            <form className="edu-form" action={url.registrationAction} method="post" onSubmit={onSubmit} noValidate>
                <EduField
                    id="fullName"
                    label="Họ và tên"
                    icon={<IconUser />}
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    defaultValue={initialFullName}
                    autoComplete="name"
                    autoFocus
                    error={errors.fullName ?? serverError("firstName", "lastName")}
                />
                <input type="hidden" name="firstName" value={names.firstName} />
                <input type="hidden" name="lastName" value={names.lastName} />

                <EduField
                    id="email"
                    name="email"
                    label="Email"
                    icon={<IconMail />}
                    type="text"
                    inputMode="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    error={errors.email ?? serverError("email", "username")}
                />
                {needsUsername && <input type="hidden" name="username" value={email.trim()} />}

                {passwordRequired && (
                    <>
                        <EduField
                            id="password"
                            name="password"
                            label="Mật khẩu"
                            icon={<IconLock />}
                            isPassword
                            placeholder="Nhập mật khẩu của bạn"
                            autoComplete="new-password"
                            error={errors.password ?? serverError("password")}
                        />
                        <EduField
                            id="password-confirm"
                            name="password-confirm"
                            label="Nhập lại mật khẩu"
                            icon={<IconLock />}
                            isPassword
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            error={errors.passwordConfirm ?? serverError("password-confirm")}
                        />
                    </>
                )}

                {termsAcceptanceRequired && (
                    <div className={`edu-field${errors.terms ?? serverError("termsAccepted") ? " edu-field-error" : ""}`}>
                        <label className="edu-check">
                            <input type="checkbox" name="termsAccepted" /> Tôi đồng ý với điều khoản sử dụng
                        </label>
                        {(errors.terms ?? serverError("termsAccepted")) && <span className="edu-error">{errors.terms ?? serverError("termsAccepted")}</span>}
                    </div>
                )}

                <button className="edu-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
                </button>
            </form>
        </EduLayout>
    );
}
