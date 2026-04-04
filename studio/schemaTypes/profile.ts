import { defineType, defineField, defineArrayMember } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Large title statement used as the big about headline",
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "Shown on the homepage overview section (under headline)",
    }),

    // ✅ NEW FIELD
    defineField({
      name: "introLine",
      title: "About Intro Line",
      type: "text",
      rows: 3,
      description:
        "Short intro shown at the top of the About overlay — appears before the long bio",
    }),

    defineField({
      name: "aboutLong",
      title: "Long About Text",
      type: "text",
      rows: 8,
      description:
        "Longer editorial paragraph shown beside the profile image in the About overlay",
    }),

    // ... rest of fields unchanged
    defineField({
      name: "avatar",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "string",
      description: "Main education line, e.g. Masters in Interaction Design",
    }),
    defineField({
      name: "educationSubtext",
      title: "Education Subtext",
      type: "string",
      description: "Second line under education, e.g. university or college name",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Main location line, e.g. London, United Kingdom",
    }),
    defineField({
      name: "locationSubtext",
      title: "Location Subtext",
      type: "string",
      description: "Second line under location if needed",
    }),
    defineField({
      name: "currentRole",
      title: "Current Work",
      type: "string",
      description: "Main current work line, e.g. UX designer at Mastercard",
    }),
    defineField({
      name: "currentRoleSubtext",
      title: "Current Work Subtext",
      type: "string",
      description: "Second line under current work, e.g. team, department, or focus",
    }),
    defineField({
      name: "featuredSection",
      title: "Featured Section",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "link", title: "Link", type: "url" }),
        defineField({ name: "linkLabel", title: "Link Label", type: "string" }),
      ],
    }),
    defineField({
      name: "stackItems",
      title: "Stack Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "title", subtitle: "subtitle", media: "icon" } },
        }),
      ],
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "period", title: "Period", type: "string" }),
            defineField({ name: "company", title: "Company / Workplace", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "company", subtitle: "period" } },
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social links",
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
  ],
});