import { defineType, defineField } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body copy",
      type: "text",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL or mailto",
              type: "string",
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true;

                  if (
                    value.startsWith("https://") ||
                    value.startsWith("http://") ||
                    value.startsWith("mailto:")
                  ) {
                    return true;
                  }

                  return "Use https://, http://, or mailto:";
                }),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
              media: "icon",
            },
          },
        },
      ],
    }),
    defineField({
      name: "resumeLabel",
      title: "Resume Label",
      type: "string",
      initialValue: "Resume",
    }),
    defineField({
      name: "resume",
      title: "Resume PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
    }),
    defineField({
      name: "resumeIcon",
      title: "Resume Icon",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});