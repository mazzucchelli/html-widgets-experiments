import { ProxyPropertyKey } from "observable-membrane/dist/shared";
import { z } from "zod";
import { WidgetFunction } from "../../types";

interface Props {
  "initial-values": {
    fullname?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
  };
}

const SignUpForm: WidgetFunction<Props> = (
  { $el, props },
  { validateProps, useState }
) => {
  validateProps(props, () => {
    return z.object({
      "initial-values": z.object({
        fullname: z.optional(z.string()),
        email: z.optional(z.string()),
        password: z.optional(z.string()),
        confirm_password: z.optional(z.string()),
      }),
    });
  });

  const serializeForm = () => {
    return Array.from($el.querySelectorAll("input")).reduce((acc, input) => {
      acc[input.name] = !!input.value ? input.value : undefined;
      return acc;
    }, {} as { [key: string]: string });
  };

  $el.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = serializeForm();
    validateForm(values)
      .then((res) => {
        console.log("validation", res);
      })
      .catch((err) => {
        onFormError(err);
      });
  });

  const validationSchema = z
    .object({
      fullname: z.string().min(1, { message: "Required field" }),
      email: z
        .string()
        .email({ message: "Invalid email" })
        .min(1, { message: "Required field" }),
      password: z.string().min(8, { message: "Password too short" }),
      confirm_password: z.string().min(8),
    })
    .strict()
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

  const onFormError = (issues: z.ZodIssue[]) => {
    console.log(issues);
    issues.forEach((issue) => {
      $el
        .querySelector(`[name="${issue.path[0]}"]`)
        .classList.add("border", "border-red-300");
    });
  };

  const validateForm = (values: any) =>
    new Promise((resolve, reject) => {
      try {
        resolve(validationSchema.parse(values));
      } catch (err) {
        if (err instanceof z.ZodError) {
          reject(err.issues);
        }
      }
    });

  // fillFormFields
  Object.keys(props["initial-values"]).forEach((key) => {
    const $input = $el.querySelector(`[name="${key}"]`) as HTMLInputElement;
    if (!$input) {
      throw new Error("No input found for key: " + key);
    }

    $input.value = props["initial-values"][key];
  });

  const getIntitialFormValues = () => {
    const obj = {};
    for (const [key, value] of Object.entries(props["initial-values"])) {
      obj[key] = {
        touched: false,
        error: "",
        value,
      };
    }
    return obj;
  };

  const initialFormValues = getIntitialFormValues();

  // const values = useState(
  //   initialFormValues,
  //   (target: any, key: ProxyPropertyKey) => {
  //     console.log("..");
  //     console.log("target", target);
  //     console.log("key", key);
  //     // console.log("change", values[key].value);

  //     for (const [key, value] of Object.entries(values)) {
  //       if (values[key].touched && values[key].error) {
  //         const $input = $el.querySelector(`[name="${key}"]`);
  //         $input.parentNode.appendChild(values[key].error);
  //       }
  //     }
  //   }
  // );

  const allInputs = $el.querySelectorAll("input");

  allInputs.forEach((input) => {
    // input.addEventListener("blur", (e) => {
    //   const $input = e.target as HTMLInputElement;
    //   const key = $input.name;
    //   if (!values[key].touched) {
    //     values[key].touched = true;
    //   }
    // });

    // input.addEventListener("change", (e) => {
    //   values[input.name].value = (e.currentTarget as HTMLInputElement).value;
    // });

    input.addEventListener("input", (e) => {
      // values[input.name].value = (e.currentTarget as HTMLInputElement).value;
    });
  });
};

export default SignUpForm;
