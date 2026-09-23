import {
  careerLeagues,
  careerOpponentClubs,
  getCareerOpponent,
} from "../data/players";

/* =========================================================
   KARİYER FİKSTÜRÜ

   - Her aşama 10 maç.
   - Yenilgi / beraberlik fikstürü ilerletmez.
   - Yalnızca galibiyet tamamlanan maç olarak kaydedilir.
   - Her galibiyette kazanılan oyuncunun adı + GEN'i tutulur.
   - Yeni aşama kendi 0/10 fikstürüyle başlar.
========================================================= */

export function createCareerFixture(
  stageNumber = 1
) {
  const stage =
    Math.min(
      10,
      Math.max(
        1,
        Number(stageNumber) || 1
      )
    );

  const league =
    careerLeagues.find(
      (item) =>
        item.stage === stage
    );

  const clubs =
    careerOpponentClubs[
      stage
    ] || [];

  const totalMatches =
    league?.matches || 10;

  return {
    stage,

    leagueName:
      league?.name ||
      `Aşama ${stage}`,

    completed: false,

    completedMatches: 0,

    matches:
      Array.from(
        {
          length: totalMatches,
        },
        (_, index) => {
          const opponent =
            clubs[index] ||
            getCareerOpponent(
              stage,
              index + 1
            );

          return {
            match:
              index + 1,

            completed:
              false,

            opponent: {
              name:
                opponent?.name ||
                `Rakip ${index + 1}`,

              short:
                opponent?.short ||
                "SCW",

              crest:
                opponent?.crest ||
                "SC",

              primary:
                opponent?.primary ||
                "#28384f",

              secondary:
                opponent?.secondary ||
                "#e8e8e8",
            },

            rewardPlayer:
              null,

            completedAt:
              null,
          };
        }
      ),
  };
}

/* =========================================================
   TÜM AŞAMALAR İÇİN BOŞ KARİYER GEÇMİŞİ
========================================================= */

export function createCareerFixtureBook() {
  const fixtures = {};

  for (
    let stage = 1;
    stage <= 10;
    stage += 1
  ) {
    fixtures[stage] =
      createCareerFixture(stage);
  }

  return fixtures;
}

/* =========================================================
   ESKİ SAVE'E FİKSTÜR EKLE

   Save'de fixtureHistory yoksa otomatik oluşturur.
========================================================= */

export function ensureCareerFixtures(
  game = {}
) {
  const current =
    game.career?.fixtures ||
    game.careerFixtures ||
    {};

  const fixtures = {};

  for (
    let stage = 1;
    stage <= 10;
    stage += 1
  ) {
    const existing =
      current[stage] ||
      current[String(stage)];

    const fresh =
      createCareerFixture(stage);

    if (!existing) {
      fixtures[stage] =
        fresh;

      continue;
    }

    fixtures[stage] = {
      ...fresh,
      ...existing,

      matches:
        fresh.matches.map(
          (
            defaultMatch,
            index
          ) => ({
            ...defaultMatch,
            ...(
              existing.matches?.[
                index
              ] || {}
            ),

            opponent: {
              ...defaultMatch.opponent,
              ...(
                existing.matches?.[
                  index
                ]?.opponent ||
                {}
              ),
            },
          })
        ),
    };
  }

  return fixtures;
}

/* =========================================================
   AKTİF AŞAMA FİKSTÜRÜ
========================================================= */

export function getStageFixture(
  fixtures,
  stageNumber = 1
) {
  const stage =
    Math.min(
      10,
      Math.max(
        1,
        Number(stageNumber) || 1
      )
    );

  return (
    fixtures?.[stage] ||
    fixtures?.[
      String(stage)
    ] ||
    createCareerFixture(stage)
  );
}

/* =========================================================
   SIRADAKİ KARİYER MAÇI
========================================================= */

export function getNextCareerMatch(
  fixtures,
  stageNumber = 1
) {
  const fixture =
    getStageFixture(
      fixtures,
      stageNumber
    );

  const next =
    fixture.matches.find(
      (match) =>
        !match.completed
    );

  return (
    next ||
    fixture.matches[
      fixture.matches.length -
        1
    ]
  );
}

/* =========================================================
   MAÇ TAMAMLANDI MI?
========================================================= */

export function isCareerMatchCompleted(
  fixtures,
  stageNumber,
  matchNumber
) {
  const fixture =
    getStageFixture(
      fixtures,
      stageNumber
    );

  return Boolean(
    fixture.matches.find(
      (match) =>
        match.match ===
          Number(
            matchNumber
          ) &&
        match.completed
    )
  );
}

/* =========================================================
   AŞAMA TAMAMLANDI MI?
========================================================= */

export function isCareerStageCompleted(
  fixtures,
  stageNumber
) {
  const fixture =
    getStageFixture(
      fixtures,
      stageNumber
    );

  return Boolean(
    fixture.completed ||
      fixture.matches.every(
        (match) =>
          match.completed
      )
  );
}

/* =========================================================
   GALİBİYETİ FİKSTÜRE YAZ

   rewardPlayer örneği:
   {
     id,
     name,
     overall,
     position,
     country
   }
========================================================= */

export function recordCareerWin(
  fixtures,
  stageNumber,
  matchNumber,
  rewardPlayer
) {
  const stage =
    Math.min(
      10,
      Math.max(
        1,
        Number(stageNumber) || 1
      )
    );

  const nextFixtures = {
    ...fixtures,
  };

  const current =
    getStageFixture(
      nextFixtures,
      stage
    );

  const updatedMatches =
    current.matches.map(
      (match) => {
        if (
          match.match !==
          Number(matchNumber)
        ) {
          return match;
        }

        return {
          ...match,

          completed: true,

          rewardPlayer:
            rewardPlayer
              ? {
                  id:
                    rewardPlayer.id,

                  name:
                    rewardPlayer.name,

                  overall:
                    rewardPlayer.overall,

                  position:
                    rewardPlayer.position,

                  country:
                    rewardPlayer.country,

                  rarity:
                    rewardPlayer.rarity,
                }
              : null,

          completedAt:
            Date.now(),
        };
      }
    );

  const completedMatches =
    updatedMatches.filter(
      (match) =>
        match.completed
    ).length;

  nextFixtures[stage] = {
    ...current,

    matches:
      updatedMatches,

    completedMatches,

    completed:
      completedMatches >=
      updatedMatches.length,
  };

  return nextFixtures;
}

/* =========================================================
   FİKSTÜR EKRANI İÇİN SATIRLAR
========================================================= */

export function getCareerFixtureRows(
  fixtures,
  stageNumber
) {
  const fixture =
    getStageFixture(
      fixtures,
      stageNumber
    );

  return fixture.matches.map(
    (match) => ({
      match:
        match.match,

      opponent:
        match.opponent,

      completed:
        match.completed,

      rewardPlayer:
        match.rewardPlayer,

      rewardText:
        match.completed &&
        match.rewardPlayer
          ? `${match.rewardPlayer.name} • ${match.rewardPlayer.overall} GEN`
          : "",

      statusText:
        match.completed
          ? "✅ TAMAMLANDI"
          : match.match ===
              fixture.completedMatches +
                1
            ? "⚔️ SIRADAKİ MAÇ"
            : "🔒 BEKLİYOR",
    })
  );
}

/* =========================================================
   AŞAMA ÖZETİ

   ÖRNEK:
   AŞAMA 3 • 4/10
========================================================= */

export function getCareerFixtureSummary(
  fixtures,
  stageNumber
) {
  const fixture =
    getStageFixture(
      fixtures,
      stageNumber
    );

  const completed =
    fixture.matches.filter(
      (match) =>
        match.completed
    ).length;

  const total =
    fixture.matches.length;

  return {
    completed,
    total,

    finished:
      completed >= total,

    text:
      `${completed}/${total}`,

    title:
      `AŞAMA ${fixture.stage} • ${completed}/${total} MAÇ`,
  };
}

/* =========================================================
   RAKİP LOGO VERİSİ

   Gerçek resim dosyası gerektirmez.
   App içinde CSS ile kalkan oluşturacağız.
========================================================= */

export function getClubCrestStyle(
  club
) {
  return {
    "--club-primary":
      club?.primary ||
      "#26384f",

    "--club-secondary":
      club?.secondary ||
      "#eeeeee",
  };
}

/* =========================================================
   KARİYER GEÇMİŞİ

   Tamamlanan eski aşamaları göstermek istersek kullanacağız.
========================================================= */

export function getCompletedCareerHistory(
  fixtures = {}
) {
  return Object.values(
    fixtures
  )
    .filter(
      (fixture) =>
        fixture?.completed
    )
    .sort(
      (a, b) =>
        a.stage - b.stage
    )
    .map(
      (fixture) => ({
        stage:
          fixture.stage,

        leagueName:
          fixture.leagueName,

        matches:
          fixture.matches,

        rewards:
          fixture.matches
            .map(
              (match) =>
                match.rewardPlayer
            )
            .filter(Boolean),
      })
    );
}