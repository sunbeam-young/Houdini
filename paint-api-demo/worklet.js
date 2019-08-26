registerPaint('ripple', class {
  static get inputProperties() {
    return [
      '--ripple-color',
      '--animation-tick',
      '--ripple-x',
      '--ripple-y'
    ]
  }

  paint(ctx, geom, properties) {
    const rippleColor = properties.get('--ripple-color').toString();
    const x = parseFloat(properties.get('--ripple-x').toString());
    const y = parseFloat(properties.get('--ripple-y').toString());
    let tick = parseFloat(properties.get('--animation-tick').toString());
    if(tick < 0)
      tick = 0;
    if(tick > 1000)
      tick = 1000;

    ctx.fillStyle = rippleColor;
    ctx.globalAlpha = 1 - tick/1000;
    ctx.arc(
      x, y, // center
      geom.width * tick/1000, // radius
      0, // startAngle
      2 * Math.PI // endAngle
    );
    ctx.fill();
  }
});