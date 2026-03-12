// studio/schemaTypes/contact.ts
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
      type: "string",
    }),
    defineField({
      name: "portfolioLink",
      title: "Primary link label",
      type: "string",
    }),
    defineField({
      name: "portfolioUrl",
      title: "Primary link URL",
      type: "url",
    }),
    defineField({
      name: "secondaryLabel",
      title: "Secondary link label",
      type: "string",
    }),
    defineField({
      name: "secondaryUrl",
      title: "Secondary link URL",
      type: "url",
    }),
  ],
});
