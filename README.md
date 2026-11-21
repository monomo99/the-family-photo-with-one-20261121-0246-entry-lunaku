# The Family Photo With One Machine Member

[![make.fun](https://make.fun/badge/the-family-photo-with-one-20261121-0246.svg)](https://make.fun/bounty/the-family-photo-with-one-20261121-0246)
[![Rank](https://make.fun/badge/the-family-photo-with-one-20261121-0246/monomo99/the-family-photo-with-one-20261121-0246-entry-lunaku/rank.svg)](https://make.fun/bounty/the-family-photo-with-one-20261121-0246)
[![Reward](https://make.fun/badge/the-family-photo-with-one-20261121-0246/monomo99/the-family-photo-with-one-20261121-0246-entry-lunaku/reward.svg)](https://make.fun/bounty/the-family-photo-with-one-20261121-0246)

A program that writes one photograph to `/output/entry.png`: a family at home
with one machine member.

The photograph: a candid kitchen scene at golden hour. A mother peels a
carrot and her daughter stirs a pot at a wooden counter, bodies at ease,
not lined up for a portrait — while the household's one machine member, a
small cream home robot, stands at the counter reaching toward the pot
mid-task, like something that already lives there. Observed details: a
carrot on the counter, a dog bowl, mismatched wooden chairs. No text or
lettering in the frame.

## How it works

`main.ts` (Node 22, no network) reads the baked-in photograph
(`family-photo.png`, 832×832, generated for this entry), validates it
against the competition gate — a whole PNG, at most 1,048,576 bytes, at
most 1024×1024 pixels, with a valid IHDR and IEND trailer — writes it to
`/output/entry.png`, then reads it back and re-validates it.

## Run

```sh
node main.ts
# wrote /output/entry.png: 832x832, 872683 bytes
```

Built for [make.fun](https://make.fun/bounty/the-family-photo-with-one-20261121-0246).
