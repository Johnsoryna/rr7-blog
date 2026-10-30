import { data, Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/posts.new";
import { createPost } from "~/lib/posts.server";
import { getClientIp, isRateLimited } from "~/lib/rate-limit.server";
import { AlertIcon } from "~/components/icons";

const MAX_TITLE = 120;
const MAX_BODY = 10000;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Neuer Beitrag | RR7 Blog" },
    {
      name: "description",
      content: "Einen neuen Beitrag im RR7 Blog erstellen.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (formData.get("website")) {
    return redirect("/");
  }

  const errors: { title?: string; body?: string; form?: string } = {};
  if (!title) {
    errors.title = "Bitte einen Titel eingeben.";
  } else if (title.length > MAX_TITLE) {
    errors.title = `Der Titel darf höchstens ${MAX_TITLE} Zeichen lang sein.`;
  }
  if (!body) {
    errors.body = "Bitte einen Text eingeben.";
  } else if (body.length > MAX_BODY) {
    errors.body = `Der Text darf höchstens ${MAX_BODY} Zeichen lang sein.`;
  }

  if (errors.title || errors.body) {
    return data({ errors, values: { title, body } }, { status: 400 });
  }

  if (isRateLimited(getClientIp(request))) {
    errors.form =
      "Zu viele Beiträge in kurzer Zeit. Bitte in ein paar Minuten nochmals versuchen.";
    return data({ errors, values: { title, body } }, { status: 429 });
  }

  const id = createPost(title, body);
  return redirect(`/posts/${id}`);
}

export default function NewPost({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const errors = actionData?.errors;

  return (
    <>
      <header className="page-head">
        <h1 className="page-title">Neuer Beitrag</h1>
      </header>
      <Form method="post" className="form">
        {errors?.form && (
          <p role="alert" className="alert">
            <AlertIcon />
            <span>{errors.form}</span>
          </p>
        )}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="title" className="field-label">
            Titel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={MAX_TITLE}
            defaultValue={actionData?.values.title}
            aria-invalid={errors?.title ? true : undefined}
            aria-describedby={errors?.title ? "title-error" : undefined}
            className="input"
          />
          {errors?.title && (
            <p id="title-error" className="field-error">
              <AlertIcon />
              <span>{errors.title}</span>
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="body" className="field-label">
            Text
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            required
            maxLength={MAX_BODY}
            defaultValue={actionData?.values.body}
            aria-invalid={errors?.body ? true : undefined}
            aria-describedby={errors?.body ? "body-error" : undefined}
            className="input"
          />
          {errors?.body && (
            <p id="body-error" className="field-error">
              <AlertIcon />
              <span>{errors.body}</span>
            </p>
          )}
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="button button-primary"
          >
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? "Wird gespeichert..." : "Veröffentlichen"}
          </button>
        </div>
      </Form>
    </>
  );
}
