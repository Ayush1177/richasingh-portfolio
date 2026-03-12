import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'richasingh.portfolio',

  projectId: 'kv3xl6sl',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
