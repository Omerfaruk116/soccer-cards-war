import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const outputDir =
  path.resolve(
    "public/icons"
  );

fs.mkdirSync(
  outputDir,
  {
    recursive: true,
  }
);

const GOLD = [
  214,
  168,
  76,
  255,
];

const GOLD_LIGHT = [
  240,
  207,
  119,
  255,
];

const BG = [
  7,
  9,
  13,
  255,
];

const PANEL = [
  18,
  22,
  29,
  255,
];

const FONT = {
  S: [
    "11111",
    "10000",
    "10000",
    "11111",
    "00001",
    "00001",
    "11111",
  ],

  C: [
    "11111",
    "10000",
    "10000",
    "10000",
    "10000",
    "10000",
    "11111",
  ],

  W: [
    "10001",
    "10001",
    "10001",
    "10101",
    "10101",
    "10101",
    "01010",
  ],
};

function crc32(buffer) {
  let crc =
    0xffffffff;

  for (
    const byte of buffer
  ) {
    crc ^= byte;

    for (
      let bit = 0;
      bit < 8;
      bit += 1
    ) {
      crc =
        (crc >>> 1) ^
        (0xedb88320 &
          -(crc & 1));
    }
  }

  return (
    crc ^
    0xffffffff
  ) >>> 0;
}

function chunk(
  type,
  data
) {
  const typeBuffer =
    Buffer.from(type);

  const length =
    Buffer.alloc(4);

  length.writeUInt32BE(
    data.length,
    0
  );

  const crc =
    Buffer.alloc(4);

  crc.writeUInt32BE(
    crc32(
      Buffer.concat([
        typeBuffer,
        data,
      ])
    ),
    0
  );

  return Buffer.concat([
    length,
    typeBuffer,
    data,
    crc,
  ]);
}

function setPixel(
  pixels,
  size,
  x,
  y,
  color
) {
  if (
    x < 0 ||
    y < 0 ||
    x >= size ||
    y >= size
  ) {
    return;
  }

  const index =
    (y * size + x) *
    4;

  pixels[index] =
    color[0];

  pixels[index + 1] =
    color[1];

  pixels[index + 2] =
    color[2];

  pixels[index + 3] =
    color[3];
}

function fillRect(
  pixels,
  size,
  x,
  y,
  width,
  height,
  color
) {
  for (
    let py = y;
    py < y + height;
    py += 1
  ) {
    for (
      let px = x;
      px < x + width;
      px += 1
    ) {
      setPixel(
        pixels,
        size,
        px,
        py,
        color
      );
    }
  }
}

function fillCircle(
  pixels,
  size,
  cx,
  cy,
  radius,
  color
) {
  const r2 =
    radius *
    radius;

  for (
    let y =
      cy - radius;
    y <=
    cy + radius;
    y += 1
  ) {
    for (
      let x =
        cx - radius;
      x <=
      cx + radius;
      x += 1
    ) {
      const dx =
        x - cx;

      const dy =
        y - cy;

      if (
        dx * dx +
          dy * dy <=
        r2
      ) {
        setPixel(
          pixels,
          size,
          x,
          y,
          color
        );
      }
    }
  }
}

function drawLetter(
  pixels,
  size,
  letter,
  x,
  y,
  scale,
  color
) {
  const rows =
    FONT[letter];

  rows.forEach(
    (
      row,
      rowIndex
    ) => {
      [
        ...row,
      ].forEach(
        (
          value,
          colIndex
        ) => {
          if (
            value === "1"
          ) {
            fillRect(
              pixels,
              size,

              x +
                colIndex *
                  scale,

              y +
                rowIndex *
                  scale,

              scale,
              scale,

              color
            );
          }
        }
      );
    }
  );
}

function createIcon(
  size
) {
  const pixels =
    Buffer.alloc(
      size *
        size *
        4
    );

  fillRect(
    pixels,
    size,
    0,
    0,
    size,
    size,
    BG
  );

  const border =
    Math.max(
      6,
      Math.round(
        size *
          0.035
      )
    );

  const inset =
    Math.round(
      size *
        0.08
    );

  fillRect(
    pixels,
    size,
    inset,
    inset,
    size -
      inset * 2,
    border,
    GOLD_LIGHT
  );

  fillRect(
    pixels,
    size,
    inset,
    size -
      inset -
      border,
    size -
      inset * 2,
    border,
    GOLD
  );

  fillRect(
    pixels,
    size,
    inset,
    inset,
    border,
    size -
      inset * 2,
    GOLD_LIGHT
  );

  fillRect(
    pixels,
    size,
    size -
      inset -
      border,
    inset,
    border,
    size -
      inset * 2,
    GOLD
  );

  const circleRadius =
    Math.round(
      size *
        0.19
    );

  fillCircle(
    pixels,
    size,
    Math.round(
      size / 2
    ),
    Math.round(
      size *
        0.39
    ),
    circleRadius,
    GOLD
  );

  fillCircle(
    pixels,
    size,
    Math.round(
      size / 2
    ),
    Math.round(
      size *
        0.39
    ),
    Math.round(
      circleRadius *
        0.79
    ),
    PANEL
  );

  fillCircle(
    pixels,
    size,
    Math.round(
      size / 2
    ),
    Math.round(
      size *
        0.39
    ),
    Math.round(
      circleRadius *
        0.26
    ),
    GOLD_LIGHT
  );

  const scale =
    Math.max(
      2,
      Math.round(
        size / 70
      )
    );

  const letterWidth =
    5 * scale;

  const gap =
    2 * scale;

  const totalWidth =
    letterWidth *
      3 +
    gap * 2;

  const startX =
    Math.round(
      (size -
        totalWidth) /
        2
    );

  const y =
    Math.round(
      size *
        0.67
    );

  drawLetter(
    pixels,
    size,
    "S",
    startX,
    y,
    scale,
    GOLD_LIGHT
  );

  drawLetter(
    pixels,
    size,
    "C",
    startX +
      letterWidth +
      gap,
    y,
    scale,
    GOLD
  );

  drawLetter(
    pixels,
    size,
    "W",
    startX +
      (letterWidth +
        gap) *
        2,
    y,
    scale,
    GOLD_LIGHT
  );

  const raw =
    Buffer.alloc(
      (size * 4 + 1) *
        size
    );

  for (
    let yIndex = 0;
    yIndex < size;
    yIndex += 1
  ) {
    const rowStart =
      yIndex *
      (size * 4 + 1);

    raw[rowStart] = 0;

    pixels.copy(
      raw,
      rowStart + 1,
      yIndex *
        size *
        4,
      (yIndex + 1) *
        size *
        4
    );
  }

  const signature =
    Buffer.from([
      137,
      80,
      78,
      71,
      13,
      10,
      26,
      10,
    ]);

  const ihdr =
    Buffer.alloc(13);

  ihdr.writeUInt32BE(
    size,
    0
  );

  ihdr.writeUInt32BE(
    size,
    4
  );

  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,

    chunk(
      "IHDR",
      ihdr
    ),

    chunk(
      "IDAT",
      zlib.deflateSync(
        raw,
        {
          level: 9,
        }
      )
    ),

    chunk(
      "IEND",
      Buffer.alloc(0)
    ),
  ]);
}

for (
  const size of [
    180,
    192,
    512,
  ]
) {
  const file =
    path.join(
      outputDir,
      `icon-${size}.png`
    );

  fs.writeFileSync(
    file,
    createIcon(size)
  );

  console.log(
    `Created ${file}`
  );
}