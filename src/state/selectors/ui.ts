import { selector } from "recoil"

import { aTags } from "../atoms/ui"
import { Tag } from "../../types"

export const aTagsAsOptions = selector<Tag[]>({
  key: "tags-as-options",
  get: ({ get }) => {
    const tags = get(aTags)

    return Object.keys(tags).map((id) => ({ id, title: tags[id] }))
  },
})
