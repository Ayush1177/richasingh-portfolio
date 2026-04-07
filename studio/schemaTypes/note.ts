import { defineField, defineType, defineArrayMember } from "sanity";

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
          { title: "Blog", value: "blog" },
        ],
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),

    defineField({
      name: "previewText",
      title: "Preview Text",
      type: "text",
      rows: 3,
      description: "Short text shown in the homepage latest section",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 10,
      description: "Longer note content shown in the latest overlay",
    }),

    // 🔹 NEW: extra sections (up to 3)
    defineField({
      name: "sections",
      title: "Additional Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "previewText",
              title: "Section Preview Text",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "body",
              title: "Section Body Text",
              type: "text",
              rows: 8,
            }),
            defineField({
              name: "image",
              title: "Right Side Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "previewText",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Untitled section",
                media,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
      description: "Up to 3 extra sections that appear only in the opened note overlay.",
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "string",
      description: 'Example: "3 min"',
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      description: 'Example: "Visit blog ⤴"',
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "url",
    }),
  ],
});