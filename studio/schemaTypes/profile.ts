import { defineType, defineField } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      name: "avatar",
      title: "Profile image",
      type: "image",
      options: { hotspot: true },
    }),
    // …any other fields you already had
  ],
});
