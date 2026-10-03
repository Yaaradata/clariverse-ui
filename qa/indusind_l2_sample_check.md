# IndusInd · public voice: hand check

**Status: not yet verified by a person.** Nothing here is approved for demo use until someone confirms it. Negative share stays hidden on every screen until `flags.sentiment_check_passed` is set to `true` in `config/indusind.yaml`, by that person, not by a script.

The file carries labels only, never review text (reviews name staff and family members). To read an item, run `python scripts/sample_check_indusind_l2.py show <id>` on a machine that has run the ingest.

## Claude's pre-score (to be confirmed)

- Product: 92 of 100 correct.
- Topics (all tags on the item right, none missing): 95 of 100.
- Sentiment (from the star rating on store reviews): 94 of 100. The misses are store reviews whose stars contradict the text (five stars on "not working").
- Typical product misses: account, branch or loan comments posted as app reviews are labelled Digital by the default rule.

## 1. 100 random on-topic items

| # | Item | Source | Product | Topics | Theme | Sentiment | Product check | Topics check | Sentiment check | Person: agree? |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `hukadra7dtddwbqc` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 2 | `5rbissl26aace5jp` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 3 | `gwdyi56rco5dhicv` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 4 | `ycd6cwguwirecrz6` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 5 | `qropcitgmf7enlnn` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 6 | `sbplnfq2kujvtcw6` | Apple App Store | app_digital | — | — | negative | wrong: account opening, not the app | ok | ok | |
| 7 | `6oywgm3ouai4c4xp` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 8 | `pz7cy5gpxwvgojui` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 9 | `eppnjyrtbtx3b3xt` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 10 | `4rrluiepqebsgk6z` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 11 | `v7gutns7sfkoo3vz` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 12 | `oe2drm4xupiobq3n` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 13 | `mkynij46orjtm3s3` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 14 | `vbwzrdru3jnaics4` | Apple App Store | cards | — | card_in_app | negative | ok | ok | ok | |
| 15 | `2xpqnm47k6awo2g2` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 16 | `75jlvmswm2lyvobp` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 17 | `22yvwjwvjbteucc5` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 18 | `mbuy7zismy3ubswl` | Google Play | app_digital | — | security_block | negative | ok | wrong: misses app_failure (screen-recorder block) | ok | |
| 19 | `avkasxo5ym5iprs3` | Google Play | app_digital | service_delay, app_failure | — | negative | ok | ok | ok | |
| 20 | `5uqwshuajrty6kc7` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 21 | `t3wylq6y4f7cqc5e` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 22 | `7ixpuu2ax543yzth` | Google Play | app_digital | app_failure | customer_care | negative | ok | ok | ok | |
| 23 | `j27e5qsbu7ikbkag` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 24 | `m4ckl5ad5zogccwp` | Google Play | app_digital | — | — | positive | wrong: a refund, product unclear | ok | wrong: unclear | |
| 25 | `q6gob63it4hwu3u7` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 26 | `w6mnlaojsdpx3iqz` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 27 | `ec26bjesdtelsfqv` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 28 | `w22k55a7bhqoj2r5` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 29 | `3x5f4wothqsolcxp` | Google Play | app_digital | app_failure | login_otp | neutral | ok | ok | wrong: rated neutral, text is negative | |
| 30 | `fn3llo3336n4rr3g` | Google Play | app_digital | — | — | negative | wrong: a warning not to open an account (deposits) | ok | ok | |
| 31 | `a2e6f7v377ydcpqf` | Google Play | app_digital | — | — | negative | wrong: bank service in general | ok | ok | |
| 32 | `kbwiygt4vqvai2wp` | Google Play | cards | — | card_bill | negative | ok | ok | ok | |
| 33 | `4epe6pb5fuobihs2` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 34 | `feml5pknyfitkum7` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 35 | `f7qevymvoxfgpuga` | Google Play | app_digital | — | update | negative | ok | ok | ok | |
| 36 | `pchlyeeoymqhn6oy` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 37 | `dymn6v3rngbzlfb6` | Google Play | app_digital | app_failure | — | positive | ok | ok | wrong: five stars, text is negative | |
| 38 | `6imhu6mhzibvs7ne` | Google Play | app_digital | — | security_block | negative | ok | ok | ok | |
| 39 | `cofl2nrnldmjftd6` | Google Play | app_digital | — | — | positive | wrong: praise for a branch | ok | ok | |
| 40 | `g3pvlw3hgoxo5eqx` | Google Play | cards | — | card_service | negative | wrong: a loan statement, not cards | ok | ok | |
| 41 | `3ihuyxgsxkbefw2f` | Google Play | cards | — | card_in_app | negative | ok | ok | ok | |
| 42 | `uddrlmgvzaeiv23d` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 43 | `s3sucm5ut32vjjl3` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 44 | `lzwiek66b5zhxhut` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 45 | `osdvwd2uvg6j3ota` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 46 | `vj75yayqkdu4vldj` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 47 | `2bzls3zx54j2r5pp` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 48 | `k5g4n72yqmq6miad` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 49 | `vv7hoxoejdqfqgsb` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 50 | `542adpoka5qybyml` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 51 | `rnbl4pwsnpzqnbod` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 52 | `rucukjd3lnvnesc7` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 53 | `izeq65z6r33qlpns` | Apple App Store | app_digital | — | update | negative | ok | ok | ok | |
| 54 | `rdtacqdey5r3qx2v` | Google Play | app_digital | service_delay | customer_care | negative | wrong: withdrawals and a branch visit (deposits) | ok | ok | |
| 55 | `523apf6jm7tvojbh` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 56 | `jdwysqmaaip4ecfq` | Google Play | app_digital | — | — | negative | wrong: a frozen account (deposits) | ok | ok | |
| 57 | `cqzyaea4yzrvgrje` | Google Play | app_digital | app_failure | — | neutral | ok | ok | ok | |
| 58 | `z3m3kpa3wh7eabgc` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 59 | `knoqfprcvpr74rhj` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 60 | `u4j6s2mkqsy62utc` | Apple App Store | app_digital | — | — | negative | ok | ok | ok | |
| 61 | `pugxideky3i3xpyy` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 62 | `anx3kehmkr7jsm5z` | Google Play | fd_rd | closure_intent, app_failure | deposit_app | negative | ok | wrong: closure_intent is wrong (uninstalling the app) | ok | |
| 63 | `5cyribyjmnvlkn3l` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 64 | `ls4xbwu25s6452iy` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 65 | `g7ob4t6qxi6ogyjx` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 66 | `65subtt4d6iktyum` | Apple App Store | nri | app_failure | deposit_app | positive | ok | ok | wrong: rated positive, text is negative | |
| 67 | `r3azpoghgf3j5b7v` | Google Play | app_digital | — | security_block | negative | ok | ok | ok | |
| 68 | `cfqwnmvqrepjcipg` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 69 | `psxcf5fb3a57jjjc` | Google Play | app_digital | — | — | neutral | ok | ok | ok | |
| 70 | `zjerj3l5f55ukszz` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 71 | `yc5ent7bxtr7hbkc` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 72 | `jhk5hht7zdrzecpu` | Google Play | app_digital | app_failure | update | negative | ok | ok | ok | |
| 73 | `bsa4eai3cp5bvtoq` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 74 | `kyvtg5gme73svmjq` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 75 | `mcfnemwwvtia6j2b` | Google Play | cards | — | card_in_app | negative | ok | ok | ok | |
| 76 | `pdls7nixbbujm7ws` | Apple App Store | app_digital | app_failure | — | negative | ok | ok | ok | |
| 77 | `yw67noj7j45c5svw` | Google Play | app_digital | app_failure | — | positive | ok | ok | wrong: rated positive, text is negative | |
| 78 | `4an3y6i7ehyvr4q5` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 79 | `ngukmj5xlyanoyss` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 80 | `siy72jpqeh7tlslr` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 81 | `tzjsprpqha4zhjul` | Google Play | app_digital | — | security_block | negative | ok | wrong: misses app_failure | ok | |
| 82 | `6zwoiebu7bggadaz` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 83 | `iw7m5yumlvnrwmzi` | Apple App Store | deposits_savings | app_failure | deposit_app | negative | ok | ok | ok | |
| 84 | `4herm6sjvu3bsz5p` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 85 | `s2jf5svpbrmuecsk` | Google Play | app_digital | — | customer_care | negative | ok | ok | ok | |
| 86 | `u3xu3vp5h5tde42u` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 87 | `de6zrpmcqtwcq5rn` | Google Play | app_digital | — | — | negative | ok | ok | ok | |
| 88 | `ghiyx547x7d76xli` | Google Play | app_digital | app_failure | login_otp | negative | ok | ok | ok | |
| 89 | `32ndsvcnhy2lqubo` | Google Play | app_digital | — | — | neutral | ok | ok | ok | |
| 90 | `dzzhrlclbyum4nt2` | Google Play | app_digital | app_failure | update | negative | ok | ok | ok | |
| 91 | `ecibesv6seep4l2r` | Google Play | cards | app_failure | card_in_app | negative | ok | ok | ok | |
| 92 | `gmbkv4oihsstrmmz` | Google Play | app_digital | app_failure | security_block | negative | ok | ok | ok | |
| 93 | `bwxz4zx4phj3v4fx` | Google Play | app_digital | — | — | positive | ok | ok | wrong: rated positive, text is negative | |
| 94 | `6lrmcmpvdjfpca63` | Google Play | app_digital | — | login_otp | negative | ok | wrong: misses app_failure | ok | |
| 95 | `x2zf6gu22jzvcwa6` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 96 | `7cn3mqzwvahfxbfv` | Google Play | app_digital | — | — | neutral | ok | ok | ok | |
| 97 | `c75kxcbngurauxmm` | Google Play | app_digital | — | — | positive | ok | ok | ok | |
| 98 | `f643sups67xnt23s` | Google Play | app_digital | app_failure | — | negative | ok | ok | ok | |
| 99 | `ljyve6rbib4mqjxu` | Google Play | app_digital | — | security_block | negative | ok | wrong: misses app_failure | ok | |
| 100 | `c3bw6y3zyv6fytjx` | Google Play | app_digital | app_failure | — | positive | ok | ok | ok | |

## 2. Top themes on screen, with their source items

Each theme's paraphrase is written by hand (`config/indusind.yaml`, `l2.themes`). Check that it is fair to the items listed. Only themes resting on at least 15 items reach a screen.

### This week

- **Deposits:** 11 items. Not enough public items this window.
- **Vehicle finance:** 0 items. Not enough public items this window.
- **Micro loans and rural:** 0 items. Not enough public items this window.
- **Cards:** 11 items. Not enough public items this window.
- **Personal loans:** 0 items. Not enough public items this window.
- **Digital:** App blocked as a security risk: "After phone updates, the app flags the device unsafe and won't open". 26 of 337 items. Source items (26): `2xc5jeomipjx4qoh`, `73cuquuypdebjgmt`, `74kjyfbpzyqvxggn`, `76abxi5neiwb6x5n`, `bgwkoabykndifeyi`, `faebkzqfrcumwmbe`, `gduzzjeibg4xpdvn`, `ivqrqnmadhz5wx4k`, `koti5xlsy3w563jh`, `kqvjrf4lmpkjxynh`, `l53jjvevffi4lyg4`, `mlugwkj56cdo5gvm`, `pjhpeeattbpddqn7`, `qb5drcs4myzebspz`, `r3rmkf5pk2y4yp6h`, `t6b3axx6f2fhrkni`, `unrdkhx6jkjls2uo`, `uovc2jgxapmzo2bg`, `vpm5mmj7herwlkhb`, `w23bct3ud25oypy3` …

### Last 4 weeks

- **Deposits:** Deposits in the app: "Savings and deposit holders cannot use the app". 18 of 39 items. Source items (18): `47ddz5pcea4vvxpm`, `5tn25aep33xc7vvg`, `75i2olojltpbzexs`, `anx3kehmkr7jsm5z`, `cuj2hn5pgoxpjpsu`, `ecamdsgh6fk37pdi`, `eqhjwaid6r6hboxy`, `i2x4jy7zhie6fypq`, `ikc75u7jgogrwkk2`, `l5aqlfx4vs2jv4ps`, `lrabf4ti6mnopdcx`, `o555566ecnx5qxgd`, `rbzswdrsfy5zqunr`, `suv7eftlgd6ergjp`, `tr43oh7qxaiezrha`, `tsc4m5bvnorjefou`, `yihvgolewwv4ono7`, `yx77aewz6icftnlx`
- **Vehicle finance:** 0 items. Not enough public items this window.
- **Micro loans and rural:** 0 items. Not enough public items this window.
- **Cards:** Cards in the app: "Card holders cannot register, activate or see their card in the app". 41 of 63 items. Source items (41): `3dstxgjpidtw4yh2`, `3gqcjtcwm26sdlyf`, `3ihuyxgsxkbefw2f`, `4ewptx2tk6vtb65n`, `4mfblruzhpex2wcf`, `5wx5boxjjzk6ebrg`, `7ocdrlpqw3nnoxom`, `apmrstgkvopg2zis`, `ba3xhokwgxz7kfms`, `blcyf7k7t7ixf3ox`, `bvfd3ymh3hvrh6xv`, `cbdb2nmw77vw22jm`, `d5vxjhbbk7daaj6f`, `ecibesv6seep4l2r`, `eyf722whiauazpy3`, `fp7o4y6fvzvnj6ff`, `fvxngnakqvzld3ns`, `g7fnri5rkwhotbig`, `gcvuo632mssni4hy`, `hnxnyagvbpzlrvr7` …
- **Personal loans:** 1 items. Not enough public items this window.
- **Digital:** App blocked as a security risk: "After phone updates, the app flags the device unsafe and won't open". 339 of 2406 items. Source items (339): `26okqf7cqtvlfjii`, `2ambwxmvmdtynw7n`, `2amrc7jezkvxskbp`, `2i3hfzsnnycluvby`, `2imdqme7e252bqu3`, `2iof7ysexrtptzyk`, `2irk7hm22p2qquap`, `2ju4vudvonzoa4vl`, `2obbjq5gc5l6tisl`, `2urvnsfrhxhi3tdg`, `2whw5xefhyffsoyk`, `2xc5jeomipjx4qoh`, `2xpqnm47k6awo2g2`, `33rj7iz4m52q5zi7`, `34lfi75x3f2njq55`, `3a7laai5n42a2nir`, `3acwqcztf575kz7y`, `3azbpj5kwb5zik5b`, `3bca4gbgvwpfd2cc`, `3bwntb5rtuyry3ts` …

### Last 13 weeks

- **Deposits:** Deposits in the app: "Savings and deposit holders cannot use the app". 41 of 88 items. Source items (41): `2b24ezvwwdb66ww4`, `2yaj4jya2upss5kj`, `47ddz5pcea4vvxpm`, `4clkrcos7mxxk3k6`, `4og7fxe7r5564ahf`, `4ozczbjvkhxrm4us`, `4v7qsrpdi6k7upkq`, `5tn25aep33xc7vvg`, `6yammefwn2hzxqhe`, `75i2olojltpbzexs`, `7un6wh6msnewtpa5`, `anx3kehmkr7jsm5z`, `cc6tabdoinadazbk`, `cuj2hn5pgoxpjpsu`, `ecamdsgh6fk37pdi`, `eqhjwaid6r6hboxy`, `hl7kfpjv7kwwisey`, `hphaeit5ylz3k5cs`, `hrntvdfpoc7b5fgi`, `hrxmufkm2lck72hh` …
- **Vehicle finance:** 0 items. Not enough public items this window.
- **Micro loans and rural:** 0 items. Not enough public items this window.
- **Cards:** Cards in the app: "Card holders cannot register, activate or see their card in the app". 125 of 174 items. Source items (125): `2cwpmofsjw6inyik`, `2dhgy72tv4pfsnix`, `2p2xwca7wnd5bu7g`, `2wpv33folv2gtjhf`, `2yculjlj5pan7y6b`, `3dstxgjpidtw4yh2`, `3gqcjtcwm26sdlyf`, `3hlopxq4s4du2hze`, `3ihuyxgsxkbefw2f`, `3povzamua22qamod`, `3vtomika5q5jto3t`, `4ewptx2tk6vtb65n`, `4hlw4g5qknvwvwx4`, `4mfblruzhpex2wcf`, `4xuus6zwx3mubyyy`, `536uwzd2djboglhn`, `5ooi4um6adodda6q`, `5wbz3e7wr63ykinu`, `5wx5boxjjzk6ebrg`, `5zlioay4kyaktprl` …
- **Personal loans:** 2 items. Not enough public items this window.
- **Digital:** App blocked as a security risk: "After phone updates, the app flags the device unsafe and won't open". 632 of 4997 items. Source items (632): `22g3qfbg6vrv7z2p`, `26okqf7cqtvlfjii`, `2ambwxmvmdtynw7n`, `2amrc7jezkvxskbp`, `2ga6pphaqjqiwlgn`, `2i3hfzsnnycluvby`, `2imdqme7e252bqu3`, `2iof7ysexrtptzyk`, `2irk7hm22p2qquap`, `2ju4vudvonzoa4vl`, `2obbjq5gc5l6tisl`, `2qd6optdeqaenxg2`, `2rdof7hwrmsw5qou`, `2rnw4d2tysc4i5m4`, `2rx5uc3cq7adppup`, `2urvnsfrhxhi3tdg`, `2vfesuacqwtw7zyq`, `2whw5xefhyffsoyk`, `2xc5jeomipjx4qoh`, `2xpqnm47k6awo2g2` …

## 3. Not shown

- Negative share: hidden until the sentiment check above is confirmed.
- "Where customers praise us" (Cards): shown only with 15 or more positive card items in the window; the last 13 weeks hold 8.
- Allegation-labelled posts: no window reaches 15 items for any business, so every slot reads "Not enough public items this window".

## 4. Topic counts, all core on-topic items (Jul–Sep)

| Topic | Items |
|---|---|
| app_failure | 1,559 |
| service_delay | 119 |
| fee_change | 42 |
| closure_intent | 27 |
| insurance_investment_sales | 12 |
| escalation_language | 8 |
| rate_offer | 2 |
| trust_governance | 1 |
