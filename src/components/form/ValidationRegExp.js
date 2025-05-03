export const ALPHA_NUMERIC = /^[a-zA-Z0-9-_ ]*$/;
export const ALPHA_NUMERIC_ONLY_UPPERCASE = /^[A-Z0-9]*$/;
export const ALPHA_NUMERIC_ONLY = /^[a-zA-Z0-9]*$/;
export const ALPHA_NUMERIC_WITH_SPECIAL =
  /^[a-zA-Z0-9\u00C0-\u017F]+([-_ ]?[a-zA-Z0-9\u00C0-\u017F]+)*$/;
export const ALPHABETIC_WITH_SPECIAL =
  /^[a-zA-Z\u00C0-\u017F]+(\s[a-zA-Z\u00C0-\u017F]+)*$/;
export const ALPHABETIC_ONLY = /^[a-zA-Z]+$/;
export const ALPHABETIC_WITH_SPACE = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s,.\-/]*$/;
export const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const FAX_REGEX = /[\+? *[1-9]+]?[0-9 ]+/;
export const NUMBER_REGEX = /^\d+$/;
export const ALPHA_NUMERIC_WITH_SPECIALCHARS =
  /^(?![&-])(?!.*[&-]$)[A-Za-z0-9 &-]+$/;
export const CUSTOM_ADDRESS_REGEX = /^[a-zA-Z0-9 ,./-]*$/; //Alphanumeric, along with below chararcters allowed Space, hypen, comma, dot. ,slash.
export const FAX_REGEX_WITHOUTSPECIAL = /^\d{6,15}$/;
//export const FIRST_NAME_REGEX = /^[a-zA-Z.\-\s]+$/;
export const FIRST_NAME_REGEX = /^[a-zA-Z\u00C0-\u017F.\-\s]+$/; //can only contain alphabets , spaces, ".", and "-",ancented
//export const MIDDLE_NAME_REGEX = /^[a-zA-Z.]+$/; //can only contain alphabets ,  "."
export const MIDDLE_NAME_REGEX = /^[a-zA-Z\u00C0-\u017F.\s]+$/; //can only contain alphabets ,space  ".",ancented
export const ALPHABETIC_WITH_SPECIAL_AND_ACCENTED =
  /^(?!\s)[\p{L}\p{M}\p{P}\p{S}\p{Zs}0-9]*?(?<!\s)$/u;
