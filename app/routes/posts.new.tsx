import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/posts.new";
import { createPost } from "~/lib/posts.server";

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

  const errors: { title?: string; body?: string } = {};
  if (!title) {
    errors.title = "Bitte einen Titel eingeben.";
  } else if (title.length > 120) {
    errors.title = "Der Titel darf höchstens 120 Zeichen lang sein.";
  }
  if (!body) {
    errors.body = "Bitte einen Text eingeben.";
  }

  if (errors.title || errors.body) {
    return { errors, values: { title, body } };
  }

  const id = createPost(title, body);
  return redirect(`/posts/${id}`);
}

export default function NewPost({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const inputClass =
    "mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900";

  return (
    <>
      <h1 className="text-3xl font-bold">Neuer Beitrag</h1>
      <Form method="post" className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className="block font-medium">
            Titel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={actionData?.values.title}
            aria-invalid={errors?.title ? true : undefined}
            aria-describedby={errors?.title ? "title-error" : undefined}
            className={inputClass}
          />
          {errors?.title && (
            <p
              id="title-error"
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="body" className="block font-medium">
            Text
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            defaultValue={actionData?.values.body}
            aria-invalid={errors?.body ? true : undefined}
            aria-describedby={errors?.body ? "body-error" : undefined}
            className={inputClass}
          />
          {errors?.body && (
            <p
              id="body-error"
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {errors.body}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {submitting ? "Wird gespeichert..." : "Veröffentlichen"}
        </button>
      </Form>
    </>
  );
}
