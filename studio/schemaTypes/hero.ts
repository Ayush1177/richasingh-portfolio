import { defineType, defineField } from "sanity";

const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "greeting",
      title: "Greeting (top left)",
      type: "string",
    }),
    defineField({
      name: "line1",
      title: "Main line",
      type: "string",
    }),
    defineField({
      name: "line2",
      title: "Second line (glitch)",
      type: "string",
    }),
    defineField({
      name: "currentRole",
      title: "Current role text",
      type: "string",
      description: "e.g. currently designing at Awesome Sauce",
    }),
    defineField({
      name: "roleColor",
      title: "Role text color",
      type: "string",
      description: "Any valid CSS color (e.g. #a855f7 or rgb(168,85,247))",
      initialValue: "#a855f7",
    }),
    defineField({
      name: "roleDotColor",
      title: "Blinking dot color",
      type: "string",
      description: "Any valid CSS color for the small circle",
      initialValue: "#a855f7",
    }),
  ],
});

export default hero;
export { hero };
