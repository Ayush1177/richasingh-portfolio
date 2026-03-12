import { defineField, defineType } from "sanity";

export const playgroundItem = defineType({
  name: "playgroundItem",
  title: "Playground item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Optional external link or case study",
    }),
  ],
});
