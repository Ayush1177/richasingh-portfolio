import { defineType, defineField, defineArrayMember } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "greeting",
      title: "Greeting",
      type: "string",
      description: "Small intro text above the main hero heading",
    }),

    defineField({
      name: "line1",
      title: "Line 1",
      type: "string",
      description: "First main line of the hero heading",
    }),

    defineField({
      name: "line1Color",
      title: "Line 1 Color",
      type: "color",
    }),

    defineField({
      name: "line2",
      title: "Line 2",
      type: "string",
      description: "Second main line of the hero heading",
    }),

    defineField({
      name: "line2Color",
      title: "Line 2 Color",
      type: "color",
    }),

    defineField({
      name: "rotatingLines",
      title: "Rotating Lines",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Text",
              type: "string",
            }),
            defineField({
              name: "color",
              title: "Color",
              type: "color",
            }),
          ],
          preview: {
            select: {
              title: "text",
            },
            prepare({ title }) {
              return {
                title: title || "Rotating line",
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "currentRole",
      title: "Current Role",
      type: "string",
      description: "Small text on the top-right of hero",
    }),

    defineField({
      name: "roleColor",
      title: "Role Text Color",
      type: "color",
    }),

    defineField({
      name: "roleDotColor",
      title: "Role Dot Color",
      type: "color",
    }),

    defineField({
      name: "heroImages",
      title: "Hero Stacking Images",
      type: "array",
      description: "Images shown in the stacked hero animation on the right side",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for accessibility",
            }),
            defineField({
              name: "rotation",
              title: "Rotation",
              type: "number",
              description: "Optional tilt value like -6, 4, 2",
            }),
          ],
          preview: {
            select: {
              title: "alt",
              media: "image",
              rotation: "rotation",
            },
            prepare({ title, media, rotation }) {
              return {
                title: title || "Hero image",
                subtitle:
                  rotation !== undefined
                    ? `Rotation: ${rotation}°`
                    : "Default rotation",
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Hero Section",
      };
    },
  },
});