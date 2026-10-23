import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { IconEye, IconEyeOff } from "./icons";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
    id: string;
    label: string;
    icon: ReactNode;
    /** Thông báo lỗi. Có thể là HTML do Keycloak trả về nên được làm sạch trước khi hiển thị. */
    error?: string;
    /** Thêm nút hiện/ẩn mật khẩu */
    isPassword?: boolean;
};

export default function EduField(props: Props) {
    const { id, label, icon, error, isPassword = false, type, ...inputProps } = props;
    const [isRevealed, setIsRevealed] = useState(false);
    const errorId = `${id}-error`;
    const hasError = error !== undefined && error !== "";

    return (
        <div className={`edu-field${hasError ? " edu-field-error" : ""}`}>
            <label htmlFor={id} className="edu-label">
                {label}
            </label>
            <div className="edu-input-wrap">
                <span className="edu-input-icon">{icon}</span>
                <input
                    {...inputProps}
                    id={id}
                    type={isPassword ? (isRevealed ? "text" : "password") : type}
                    className="edu-input"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="edu-reveal"
                        aria-label={isRevealed ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        aria-controls={id}
                        onClick={() => setIsRevealed(v => !v)}
                    >
                        {isRevealed ? <IconEyeOff /> : <IconEye />}
                    </button>
                )}
            </div>
            {hasError && <span id={errorId} className="edu-error" aria-live="polite" dangerouslySetInnerHTML={{ __html: kcSanitize(error) }} />}
        </div>
    );
}
