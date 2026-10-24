/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/**
 * Việt hóa các thông báo do máy chủ Keycloak sinh ra (sai mật khẩu, email đã tồn tại...).
 *
 * Realm không bật Internationalization nên Keycloak luôn dùng ngôn ngữ "en".
 * Vì vậy ta ghi đè chính các khóa tiếng Anh bằng câu tiếng Việt. Keycloakify ghi các
 * câu này vào messages_*.properties trong file .jar, nên máy chủ cũng dùng được.
 *
 * Lưu ý: object bên dưới phải viết trực tiếp (không dùng biến) để Keycloakify đọc được lúc build.
 * {0}, {1}, {2} là tham số Keycloak tự điền (ví dụ độ dài tối thiểu).
 *
 * @see: https://docs.keycloakify.dev/features/i18n
 */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            // Đăng nhập
            invalidUserMessage: "Email hoặc mật khẩu không đúng.",
            invalidUsernameOrEmailMessage: "Email không đúng.",
            accountDisabledMessage: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
            accountTemporarilyDisabledMessage: "Tài khoản tạm thời bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau.",
            accountPermanentlyDisabledMessage: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
            expiredCodeMessage: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            expiredActionMessage: "Thao tác đã hết hạn. Vui lòng đăng nhập lại.",
            loginTimeout: "Bạn đã quá thời gian đăng nhập. Vui lòng bắt đầu lại.",
            cookieNotFoundMessage: "Trình duyệt đang chặn cookie. Vui lòng bật cookie rồi thử lại.",
            staleCodeMessage: "Trang này không còn hợp lệ. Vui lòng quay lại ứng dụng và đăng nhập lại.",

            // Đăng ký
            missingUsernameMessage: "Vui lòng nhập email.",
            missingFirstNameMessage: "Vui lòng nhập đầy đủ họ và tên.",
            missingLastNameMessage: "Vui lòng nhập đầy đủ họ và tên.",
            missingEmailMessage: "Vui lòng nhập email.",
            invalidEmailMessage: "Email không hợp lệ.",
            missingPasswordMessage: "Vui lòng nhập mật khẩu.",
            notMatchPasswordMessage: "Mật khẩu nhập lại không khớp.",
            invalidPasswordConfirmMessage: "Mật khẩu nhập lại không khớp.",
            emailExistsMessage: "Email này đã được đăng ký.",
            usernameExistsMessage: "Email này đã được đăng ký.",

            // Chính sách mật khẩu
            invalidPasswordMinLengthMessage: "Mật khẩu phải có ít nhất {0} ký tự.",
            invalidPasswordMaxLengthMessage: "Mật khẩu không được dài quá {0} ký tự.",
            invalidPasswordMinDigitsMessage: "Mật khẩu phải có ít nhất {0} chữ số.",
            invalidPasswordMinLowerCaseCharsMessage: "Mật khẩu phải có ít nhất {0} chữ thường.",
            invalidPasswordMinUpperCaseCharsMessage: "Mật khẩu phải có ít nhất {0} chữ hoa.",
            invalidPasswordMinSpecialCharsMessage: "Mật khẩu phải có ít nhất {0} ký tự đặc biệt.",
            invalidPasswordNotUsernameMessage: "Mật khẩu không được trùng với tên đăng nhập.",
            invalidPasswordNotEmailMessage: "Mật khẩu không được trùng với email.",
            invalidPasswordRegexPatternMessage: "Mật khẩu không đúng định dạng yêu cầu.",
            invalidPasswordHistoryMessage: "Mật khẩu không được trùng với {0} mật khẩu gần nhất.",
            invalidPasswordBlacklistedMessage: "Mật khẩu này quá phổ biến. Vui lòng chọn mật khẩu khác.",
            invalidPasswordGenericMessage: "Mật khẩu không hợp lệ.",

            // Kiểm tra dữ liệu của User Profile
            "error-user-attribute-required": "Vui lòng nhập trường này.",
            "error-invalid-email": "Email không hợp lệ.",
            "error-invalid-value": "Giá trị không hợp lệ.",
            "error-invalid-length": "Độ dài phải từ {1} đến {2} ký tự.",
            "error-invalid-length-too-short": "Cần ít nhất {1} ký tự.",
            "error-invalid-length-too-long": "Không được quá {2} ký tự.",
            "error-person-name-invalid-character": "Họ tên chứa ký tự không hợp lệ.",
            "error-username-invalid-character": "Giá trị chứa ký tự không hợp lệ."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
