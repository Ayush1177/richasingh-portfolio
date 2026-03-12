import { defineField, defineType } from "sanity";

export const note = defineType({
  name: "note",
  title: "Note",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Note", value: "note" },
          { title: "Journal", value: "journal" },
        ],
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
  ],
});
