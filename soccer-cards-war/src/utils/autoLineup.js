import {
  getPositionGroup,
} from "../data/players";

const STAGE_CAPS = [
  30,
  40,
  50,
  60,
  70,
  80,
  85,
  90,
  95,
  99,
];

const SLOT_GROUPS = {
  forward: [
    "fw1",
    "fw2",
  ],

  midfield: [
    "mid1",
    "mid2",
    "mid3",
  ],

  defense: [
    "def1",
    "def2",
    "def3",
    "def4",
  ],

  goalkeeper: [
    "gk",
  ],
};

const REQUIREMENTS = {
  forward: 2,
  midfield: 3,
  defense: 4,
  goalkeeper: 1,
};

const GROUP_NAMES = {
  forward: "Forvet",
  midfield: "Orta Saha",
  defense: "Defans",
  goalkeeper: "Kaleci",
};

function getSafeStageCap(
  game,
  suppliedStageCap
) {
  const directCap =
    Number(
      suppliedStageCap
    );

  if (
    Number.isFinite(
      directCap
    ) &&
    directCap > 0
  ) {
    return directCap;
  }

  const stageIndex =
    Math.max(
      0,
      Math.min(
        9,
        (Number(
          game?.activeStage
        ) || 1) - 1
      )
    );

  return STAGE_CAPS[
    stageIndex
  ];
}

function isPlayerRented(
  game,
  playerId,
  now
) {
  return Boolean(
    game?.rentalCenter
      ?.rentals?.some(
        (rental) =>
          rental.playerId ===
            playerId &&
          !rental.finished &&
          Number(
            rental.endsAt ||
              0
          ) > now
      )
  );
}

function isPlayerWithCoach(
  game,
  playerId,
  now
) {
  return Boolean(
    game?.coaches
      ?.activeSessions?.some(
        (session) =>
          Number(
            session.endsAt ||
              0
          ) > now &&
          session.playerIds?.includes(
            playerId
          )
      )
  );
}

function isPlayerTraining(
  game,
  playerId
) {
  const training =
    game?.training;

  if (
    Array.isArray(
      training
    )
  ) {
    return training.some(
      (session) =>
        session?.playerId ===
          playerId &&
        !session?.finished
    );
  }

  return Boolean(
    training?.playerId ===
      playerId &&
    !training?.finished
  );
}

function isPlayerAvailable(
  game,
  player,
  stageCap,
  now
) {
  if (!player) {
    return false;
  }

  if (!player.id) {
    return false;
  }

  if (player.sold) {
    return false;
  }

  const overall =
    Number(
      player.overall ||
        0
    );

  if (
    overall > stageCap &&
    overall !== 100
  ) {
    return false;
  }

  if (
    isPlayerTraining(
      game,
      player.id
    )
  ) {
    return false;
  }

  if (
    isPlayerRented(
      game,
      player.id,
      now
    )
  ) {
    return false;
  }

  if (
    isPlayerWithCoach(
      game,
      player.id,
      now
    )
  ) {
    return false;
  }

  return true;
}

function sortBest(
  players
) {
  return [
    ...players,
  ].sort(
    (a, b) => {
      const overallA =
        Number(
          a?.overall ||
            0
        );

      const overallB =
        Number(
          b?.overall ||
            0
        );

      if (
        overallB !==
        overallA
      ) {
        return (
          overallB -
          overallA
        );
      }

      return String(
        a?.name || ""
      ).localeCompare(
        String(
          b?.name || ""
        )
      );
    }
  );
}

function uniquePlayersById(
  players
) {
  const seen =
    new Set();

  return (
    players || []
  ).filter(
    (player) => {
      if (
        !player ||
        !player.id ||
        seen.has(
          player.id
        )
      ) {
        return false;
      }

      seen.add(
        player.id
      );

      return true;
    }
  );
}

/*
  App.jsx şu anda bunu şöyle çağırıyor:

  buildBestLineup(
    game.collection,
    game,
    stageCap
  );

  Eski sürümlerde ise:
  buildBestLineup(game)

  şeklinde çağrılmış olabilir.

  İkisini de destekliyoruz ki
  eski save / eski kod geçişlerinde
  tekrar kırılmasın.
*/

export function buildBestLineup(
  collectionOrGame,
  maybeGame = null,
  suppliedStageCap = null
) {
  let game =
    maybeGame;

  let collection =
    collectionOrGame;

  if (
    !Array.isArray(
      collectionOrGame
    )
  ) {
    game =
      collectionOrGame;

    collection =
      game?.collection;
  }

  if (
    !game ||
    !Array.isArray(
      collection
    )
  ) {
    return {
      success: false,
      formation: {},
      squadIds: [],
      squad: [],
      players: [],
      averageOverall: 0,
      average: 0,
      message:
        "Oyuncu koleksiyonu bulunamadı.",
    };
  }

  const now =
    Date.now();

  const stageCap =
    getSafeStageCap(
      game,
      suppliedStageCap
    );

  const uniqueCollection =
    uniquePlayersById(
      collection
    );

  const available =
    uniqueCollection.filter(
      (player) =>
        isPlayerAvailable(
          game,
          player,
          stageCap,
          now
        )
    );

  const groups = {
    forward: [],
    midfield: [],
    defense: [],
    goalkeeper: [],
  };

  available.forEach(
    (player) => {
      const group =
        player.positionGroup ||
        getPositionGroup(
          player.position
        );

      if (
        groups[group]
      ) {
        groups[group].push(
          player
        );
      }
    }
  );

  Object.keys(
    groups
  ).forEach(
    (group) => {
      groups[group] =
        sortBest(
          groups[group]
        );
    }
  );

  for (
    const [
      group,
      required,
    ] of Object.entries(
      REQUIREMENTS
    )
  ) {
    if (
      groups[group].length <
      required
    ) {
      return {
        success: false,
        formation: {},
        squadIds: [],
        squad: [],
        players: [],
        averageOverall: 0,
        average: 0,
        stageCap,

        message:
          `En iyi kadro kurulamadı. ` +
          `En az ${required} kullanılabilir ${GROUP_NAMES[group]} gerekiyor. ` +
          `Şu anda ${groups[group].length} tane var.`,
      };
    }
  }

  const selectedByGroup = {
    forward:
      groups.forward.slice(
        0,
        REQUIREMENTS.forward
      ),

    midfield:
      groups.midfield.slice(
        0,
        REQUIREMENTS.midfield
      ),

    defense:
      groups.defense.slice(
        0,
        REQUIREMENTS.defense
      ),

    goalkeeper:
      groups.goalkeeper.slice(
        0,
        REQUIREMENTS.goalkeeper
      ),
  };

  /*
    Ek güvenlik:
    Her oyuncu ID'si yalnızca
    bir kere kullanılabilir.
  */

  const usedIds =
    new Set();

  const formation = {};

  Object.entries(
    SLOT_GROUPS
  ).forEach(
    ([group, slots]) => {
      const candidates =
        selectedByGroup[
          group
        ];

      slots.forEach(
        (
          slotId,
          index
        ) => {
          const player =
            candidates[
              index
            ];

          if (
            !player ||
            usedIds.has(
              player.id
            )
          ) {
            return;
          }

          usedIds.add(
            player.id
          );

          formation[
            slotId
          ] =
            player.id;
        }
      );
    }
  );

  const selectedPlayers = [
    ...selectedByGroup.forward,
    ...selectedByGroup.midfield,
    ...selectedByGroup.defense,
    ...selectedByGroup.goalkeeper,
  ].filter(
    (player) =>
      usedIds.has(
        player.id
      )
  );

  const squadIds =
    selectedPlayers.map(
      (player) =>
        player.id
    );

  if (
    squadIds.length !==
      10 ||
    new Set(
      squadIds
    ).size !== 10
  ) {
    return {
      success: false,
      formation: {},
      squadIds: [],
      squad: [],
      players: [],
      averageOverall: 0,
      average: 0,
      stageCap,

      message:
        "En iyi kadro kurulamadı. 10 farklı uygun oyuncu bulunamadı.",
    };
  }

  const totalOverall =
    selectedPlayers.reduce(
      (
        total,
        player
      ) =>
        total +
        Number(
          player.overall ||
            0
        ),
      0
    );

  const average =
    Math.round(
      (totalOverall /
        selectedPlayers.length) *
        10
    ) / 10;

  return {
    success: true,

    formation,

    /*
      App.jsx squadIds arıyor.
      Eski kod squad arıyordu.
      İkisini de veriyoruz.
    */

    squadIds,

    squad:
      squadIds,

    players:
      selectedPlayers,

    averageOverall:
      average,

    average,

    stageCap,

    message:
      `✅ En iyi kadro otomatik kuruldu. Ortalama GEN: ${average}`,
  };
}