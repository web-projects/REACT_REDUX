/* eslint-disable import/extensions */
import Konva from '../../app/vendor/js/konva7.min.js';

export default class NodeExplorerCanvasImpl {
  constructor(stage) {
    this.stage = stage;
    this.canvasData = {
      filterParams: [],
    };
    this.layer = null;
  }

  draw(node, data) {
    // dispose of existing layer
    if (this.layer) {
      this.layer.destroy();
      this.layer = null;
    }

    // create layer
    this.layer = new Konva.Layer();

    let myX = 20;
    const myY = 150;

    if (data[node.name].length > 0) {
      for (const dataKey in data[node.name]) {
        if (Object.prototype.hasOwnProperty.call(data[node.name], dataKey)) {
          const element = data[node.name][dataKey];

          // create our group
          const grp = new Konva.Group({
            x: myX,
            y: myY,
            draggable: true,
          });

          // create our text
          const text = new Konva.Text({
            x: 0,
            y: 0,
            text: element[node.displayField],
            padding: 10,
            fill: 'black',
            fontSize: 18,
            fontFamily: 'Calibri',
            width: node.displayWidth,
            align: 'center',
          });

          // create our shape
          const circle = new Konva.Circle({
            x: text.width() / 2,
            y: text.height() / 2,
            radius: text.width() / 2,
            fill: element[node.activeField] ? 'green' : 'red',
            stroke: '#555',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
          });

          // Add the rectangle to the group
          grp.add(circle);

          // Add the text to the group
          grp.add(text);

          // add the group to the layer
          this.layer.add(grp);

          // create tooltipGrp
          const tooltipGrp = new Konva.Group({
            x: 0,
            y: 0,
            opacity: 0,
            visible: false,
          });

          // Form tooltip text string
          let textStr = '';
          for (let i = 0; i < node.tooltipFields.length; i++) {
            const tooltipKey = node.tooltipFields[i];
            textStr += `${tooltipKey}: ${element[tooltipKey.toLowerCase()]}\n`;
          }

          textStr.trimRight('\n');

          // Create tooltip text
          const tooltipText = new Konva.Text({
            x: 0,
            y: 0,
            text: textStr,
            padding: 10,
            fill: 'black',
            fontSize: 18,
            fontFamily: 'Calibri',
          });

          // Create tooltipRect
          const tooltipRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: tooltipText.width(),
            // Despite trimming trailing newline char, it seems like there is still an extra line at the end of the text.
            // Reduce height by 18px to compensate.
            height: tooltipText.height() - 18,
            stroke: '#555',
            strokeWidth: 5,
            fill: '#ddd',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
            cornerRadius: 10,
          });

          // Add tooltipRect to tooltipGrp
          tooltipGrp.add(tooltipRect);

          // Add tooltipText to tooltipGrp
          tooltipGrp.add(tooltipText);

          // Add tooltip text to layer
          this.layer.add(tooltipGrp);

          // Add mouseover event to grp
          grp.on('mouseenter', () => {
            // Set custom variable 'hover' to true to track if we are still hovering after short delay
            grp.hover = true;
            // After short delay..
            setTimeout(() => {
              // Check if we are still hovering over the grp
              if (grp.hover) {
                // Get the bounding rectangle of the given circle
                const circleClientRect = circle.getClientRect();
                // Set the position of the tooltip
                tooltipGrp.position({
                  x: circleClientRect.x + circleClientRect.width / 2 > this.stage.width() / 2
                    ? circleClientRect.x - tooltipRect.width()
                    : circleClientRect.x + circleClientRect.width,
                  y: circleClientRect.y,
                });
                // Place tooltip on top of any other shapes
                tooltipGrp.moveToTop();
                // Show tooltip (sets visible = true)
                tooltipGrp.show();
                // Fade tooltip in
                tooltipGrp.to({
                  opacity: 0.9,
                });
              }
            }, 500);
          });

          // Add mouseout event to grp
          grp.on('mouseleave', () => {
            // Set custom variable 'hover' to false so we know we are no longer hovering
            grp.hover = false;
              // Fade tooltip out
              tooltipGrp.to({
                opacity: 0,
                // When finished, hide the tooltip (sets visible = false).
                // This is required to prevent it being invisible but sitting on top of other shapes.
                onFinish: () => tooltipGrp.hide(),
              });
          });

          // set filter parameters
          if (node.filterKeys !== undefined) {
            grp.on('contextmenu', () => {
              this.canvasData.filterParams = [];
              for (const i in node.filterKeys) {
                const filterKey = node.filterKeys[i];
                this.canvasData.filterParams.push({ key: filterKey, value: element[filterKey] });
              }
            });
          }

          myX += 320;
          // todo: myY
        }
      }
    } else {
      const noDataText = new Konva.Text({
        x: this.stage.width() / 2 - 50,
        y: 100,
        text: 'No data to display.',
        fill: 'gray',
        fontSize: 18,
        fontFamily: 'Calibri',
      });
      this.layer.add(noDataText);
    }

    // add the layer to the stage
    this.stage.add(this.layer);

    // draw the stage
    this.stage.draw();

    // adapt the stage on any window resize
    window.addEventListener('resize', this.fitStageIntoParentContainer);
  }

  fitStageIntoParentContainer = () => {
    const container = this.stage.container();

    // get elements to calculate canvas element height
    const canvasElement = $(container);
    const parentElement = canvasElement.parent().parent();

    // set new height of canvas element
    const canvasElementHeight = $(window).height() - canvasElement.offset().top - (parentElement.outerHeight(true) - parentElement.height()) - 41;
    // canvasElement must be at least 1px in height or error is thrown attempting to draw
    canvasElement.height(Math.max(canvasElementHeight, 1));

    // get stage width & height
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();

    // to do this we need to scale the stage
    const scaleX = container.offsetWidth / stageWidth;
    const scaleY = container.offsetHeight / stageHeight;

    // now set new stage width & height
    this.stage.width(stageWidth * scaleX);
    this.stage.height(stageHeight * scaleY);

    // finally, redraw stage
    this.stage.draw();
  }

  bindContextMenuBehavior(contextMenuTargetId) {
    const menuNode = document.getElementById(contextMenuTargetId);

    window.addEventListener('click', () => {
      // hide menu
      menuNode.style.display = 'none';
    });

    this.stage.on('contextmenu', (e) => {
      // prevent default behavior
      e.evt.preventDefault();
      if (e.target === this.stage) {
        // if we are on empty place of the stage we will do nothing
        return;
      }

      // show menu
      menuNode.style.display = 'initial';
      // TODO: Menu position is computed using offset & dimensions + padding of surrounding card-header & card-body.
      // This should be fixed later so not add hard-coded values.
      const ptrPosition = this.stage.getPointerPosition();
      menuNode.style.top = `${ptrPosition.y + 77}px`;
      menuNode.style.left = `${ptrPosition.x + 20}px`;
    });
  }

  clear() {
    this.stage.clear();
  }
}
