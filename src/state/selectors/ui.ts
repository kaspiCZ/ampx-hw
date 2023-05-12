import { selector } from "recoil"

import { aTags } from "../atoms/ui"
import { TagAsAutocompleteOption } from "../../types"

export const aTagsAsOptions = selector<TagAsAutocompleteOption[]>({
  key: "tags-as-options",
  get: ({ get }) => {
    const tags = get(aTags)

    return Object.keys(tags).map((id) => ({ id, title: tags[id] }))
  },
})
