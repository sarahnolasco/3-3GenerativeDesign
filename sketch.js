
let bandsSlider;
let thicknessSlider;
let spreadSlider;
let layersSlider;

let colorOnePicker;
let colorTwoPicker;

let surpriseButton;
let sheetButton;
let saveButton;

let variationSeed = 42;
let canvasSize = 620;

function setup() {
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("canvas-holder");

  pixelDensity(2);
  angleMode(RADIANS);
  noLoop();

  // Sliders control the structure of the pattern.
  bandsSlider = createSlider(8, 32, 18, 1);
  bandsSlider.parent("bands-control");
  bandsSlider.id("bands-slider");

  thicknessSlider = createSlider(1, 10, 5, 1);
  thicknessSlider.parent("thickness-control");
  thicknessSlider.id("thickness-slider");

  spreadSlider = createSlider(55, 100, 88, 1);
  spreadSlider.parent("spread-control");
  spreadSlider.id("spread-slider");

  layersSlider = createSlider(2, 8, 5, 1);
  layersSlider.parent("layers-control");
  layersSlider.id("layers-slider");

  // Color pickers control the two pattern colors.
  colorOnePicker = createColorPicker("#29262b");
  colorOnePicker.parent("color-one-control");

  colorTwoPicker = createColorPicker("#e9a9c7");
  colorTwoPicker.parent("color-two-control");

  // Create the required p5.js buttons.
  surpriseButton = createButton("Surprise me");
  surpriseButton.parent("surprise-row");
  surpriseButton.class("text-button");
  surpriseButton.mousePressed(surpriseMe);

  sheetButton = createButton("Sheet");
  sheetButton.parent("action-row");
  sheetButton.class("text-button");
  sheetButton.mousePressed(resetSheet);

  saveButton = createButton("Save PNG");
  saveButton.parent("action-row");
  saveButton.class("text-button");
  saveButton.mousePressed(exportDesign);

  // Update the pattern whenever a control changes.
  bandsSlider.input(refreshDesign);
  thicknessSlider.input(refreshDesign);
  spreadSlider.input(refreshDesign);
  layersSlider.input(refreshDesign);

  colorOnePicker.input(refreshDesign);
  colorTwoPicker.input(refreshDesign);

  redraw();
}

function draw() {
  // Read the current parameter values.
  const bandCount = bandsSlider.value();
  const thickness = thicknessSlider.value();
  const spread = spreadSlider.value() / 100;
  const layerCount = layersSlider.value();

  const colorOne = color(colorOnePicker.value());
  const colorTwo = color(colorTwoPicker.value());

  background(255);

  // Keep random details consistent until a new variation is requested.
  randomSeed(variationSeed);

  // Center all the artwork on the canvas.
  translate(width / 2, height / 2);

  const outerRadius = width * 0.385 * spread;

  // Fixed outer circle frames the generated pattern.
  noFill();
  stroke(colorOne);
  strokeWeight(1.2);
  circle(0, 0, outerRadius * 2.18);

  // Create concentric layers.
  for (let layer = 0; layer < layerCount; layer++) {
    push();

    const layerProgress = (layer + 1) / layerCount;
    const radius = outerRadius * (0.28 + layerProgress * 0.67);
    const angleStep = TWO_PI / bandCount;

    // Rotate every other layer to create an interlocking effect.
    if (layer % 2 === 1) {
      rotate(angleStep / 2);
    }

    const layerColor =
      (layer % 2 === 0) ? colorOne : colorTwo;

    // Repeat the ornaments around the circle.
    for (let i = 0; i < bandCount; i++) {
      push();

      rotate(i * angleStep);

      const sizeVariation = random(0.88, 1.12);
      const shapeSize =
        (width * 0.045 + layer * 1.2) * sizeVariation;

      // Alternate between filled diamonds and angular outlines.
      if ((i + layer) % 2 === 0) {
        noStroke();
        fill(layerColor);

        translate(0, -radius);
        rotate(PI / 4);

        rectMode(CENTER);
        rect(0, 0, shapeSize, shapeSize * 0.82);

      } else {
        noFill();
        stroke(layerColor);
        strokeWeight(thickness);

        translate(0, -radius);

        beginShape();

        vertex(0, -shapeSize);
        vertex(shapeSize * 0.42, -shapeSize * 0.25);
        vertex(shapeSize, 0);
        vertex(shapeSize * 0.42, shapeSize * 0.25);
        vertex(0, shapeSize);
        vertex(-shapeSize * 0.42, shapeSize * 0.25);
        vertex(-shapeSize, 0);
        vertex(-shapeSize * 0.42, -shapeSize * 0.25);

        endShape(CLOSE);
      }

      // Add contrasting dots at alternating positions.
      if (i % 2 === 0) {
        noStroke();

        fill(
          (layer % 2 === 0) ? colorTwo : colorOne
        );

        circle(
          0,
          -radius - shapeSize * 0.65,
          max(2, thickness * 0.9)
        );
      }

      pop();
    }

    // Connecting rings unify the design.
    noFill();
    stroke(layerColor);
    strokeWeight(max(1, thickness * 0.45));
    circle(0, 0, radius * 2);

    pop();
  }

  // Central rosette anchors the different variations.
  const centerRadius = outerRadius * 0.24;

  noStroke();
  fill(colorTwo);
  circle(0, 0, centerRadius * 2.1);

  fill(255);
  circle(0, 0, centerRadius * 1.25);

  // Repeated center details use the same radial system.
  for (let i = 0; i < bandCount; i++) {
    push();

    rotate((TWO_PI / bandCount) * i);

    noStroke();
    fill(colorOne);

    circle(
      0,
      -centerRadius * 0.78,
      max(2, thickness * 0.85)
    );

    pop();
  }
}

function refreshDesign() {
  redraw();
}

function surpriseMe() {
  // Randomize parameters within the defined ranges.
  bandsSlider.value(floor(random(8, 33)));
  thicknessSlider.value(floor(random(1, 11)));
  spreadSlider.value(floor(random(55, 101)));
  layersSlider.value(floor(random(2, 9)));

  // A limited palette keeps all designs visually related.
  const palettes = [
    ["#29262b", "#e9a9c7"],
    ["#252c36", "#a9c7e8"],
    ["#34302d", "#e9c47a"],
    ["#33283d", "#c9b7e8"],
    ["#283b34", "#b9d7c4"],
    ["#482c34", "#edaaa0"],
    ["#343434", "#f0c7dd"]
  ];

  const selectedPalette = random(palettes);

  colorOnePicker.value(selectedPalette[0]);
  colorTwoPicker.value(selectedPalette[1]);

  variationSeed = floor(random(1, 1000000));

  redraw();
}

function resetSheet() {
  // Restore the original settings and default palette.
  bandsSlider.value(18);
  thicknessSlider.value(5);
  spreadSlider.value(88);
  layersSlider.value(5);

  colorOnePicker.value("#29262b");
  colorTwoPicker.value("#e9a9c7");

  variationSeed = 42;

  redraw();
}

function exportDesign() {
  // Download the canvas artwork as a PNG file.
  saveCanvas("generative-pattern", "png");
}