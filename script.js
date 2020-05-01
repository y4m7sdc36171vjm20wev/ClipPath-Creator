class JClip {
    constructor(CONTAINERID, RESULTID) {
        this.play = document.querySelectorAll(`#${CONTAINERID}`)[0];
        this.result = document.querySelectorAll(`#${RESULTID}`)[0];
        this.width = this.play.clientWidth;
        this.height = this.play.clientHeight;
        this.selectMode = false;

        this.pointArray = [];
        this.pointCount = 0;

        this.selectedPoint = null;

        let mouseX = 0;
        let mouseY = 0;

        this.play.onmousemove = (data) => {
            mouseX = data.offsetX;
            mouseY = data.offsetY;
        }
        window.onkeypress = (data) => {
            switch (data.key) {
                case "s":
                    let mode = "";
                    if (this.selectMode === false) {
                        mode = "Activated";
                    } else {
                        mode = "Deactivated";
                    }
                    console.log("SelectMode " + mode);
                    this.selectMode = !this.selectMode;
                    break;
                case "z":
                    if (this.pointCount != 0) {
                        document.querySelectorAll("[data-point]")[this.pointCount - 1].remove();
                        this.pointArray.splice(this.pointArray.length - 1, 1);
                        this.pointCount += -1;
                    }
            }
        }

        this.play.onclick = () => {
            if (this.selectMode === false) {
                if (this.check(mouseX, mouseY) === true) {
                    this.pointArray[this.pointCount] = [mouseX, mouseY];
                    this.pointCount += 1;
                    this.drawPoint(mouseX, mouseY);

                    if (this.pointArray.length >= 3) {
                        this.toClip_Path();
                    } else {
                        this.clipPath = "";
                    }
                }

            } else {
                if (this.select(mouseX, mouseY) === false) {
                }
            }

        }


    }
    toClip_Path() {
        let text = "clip-path: polygon(";
        for (let point of this.pointArray) {
            text += this.per(point[0], "X") + "% " + this.per(point[1], "Y") + "%,";
        }
        text = text.slice(0, text.length - 1);
        text += ");"
        this.result.innerHTML = text;
        this.result.classList.add("active")
        this.clipPath = text;
    }
    per(num, coord) {
        if (coord === "X") {
            return ((num / this.width).toFixed(2) * 100).toFixed(0);
        }
        if (coord == "Y") {
            return ((num / this.height).toFixed(2) * 100).toFixed(0);
        }
    }
    pix(num, coord) {
        if (coord === "X") {
            return ((num * this.width).toFixed(2) / 100).toFixed(0);
        }
        if (coord == "Y") {
            return ((num * this.height).toFixed(2) / 100).toFixed(0);
        }
    }
    drawPoint(x, y, opt) {
        let count;
        if (opt != null) {
            count = opt;
        } else {
            count = this.pointCount;
        }

        let pointParent = document.createElement("DIV");
        pointParent.setAttribute("data-point", count)
        pointParent.style = `position: absolute; width: ` + this.clientWidth + `px; width: ` + this.width + `px;  height: ` + this.height + `px;`;

        let point = document.createElement("DIV");
        point.style = `position:absolute; z-index: 4; left: ` + (x - 2.5) + `px; top: ` + (y - 2.5) + `px; width: 5px; height: 5px; background: red; border-radius: 100%; border: 1px solid blue;`

        pointParent.appendChild(point);
        this.play.appendChild(pointParent);
    }
    check(mouseX, mouseY) {
        for (let i = 0; i < this.pointArray.length; i++) {
            let x = this.pointArray[i][0];
            let y = this.pointArray[i][1];
            if (mouseY >= (y - 5) && mouseY <= (y + 5)) {
                if (mouseX >= (x - 5) && mouseX <= (x + 5)) {
                    document.querySelectorAll("[data-point]")[i].remove();
                    this.pointCount += -1;
                    this.pointArray.splice(i, 1);
                    return false;
                }
            }
        }
        return true;
    }
    select(mouseX, mouseY) {
        for (let i = 0; i < this.pointArray.length; i++) {
            let x = this.pointArray[i][0];
            let y = this.pointArray[i][1];
            if (mouseY > (y - 10) && mouseY < (y + 10)) {
                if (mouseX > (x - 10) && mouseX < (x + 10)) {
                    this.selectedPoint = i;

                    let x = this.pointArray[this.selectedPoint][0]
                    let y = this.pointArray[this.selectedPoint][1]
                    document.getElementById('upd').value = `${this.per(x, "X")} ${this.per(y, "Y")}`;

                    return false;
                }
            }
        }
        return true;
    }
    manualPoint(x, y, grid) {

        if (grid == null) {
            x = this.pix(x, "X");
            y = this.pix(y, "Y");
            this.pointArray[this.pointCount] = [x, y];
            this.pointCount += 1;
            this.drawPoint(x, y);

            if (this.pointArray.length >= 3) {
                this.toClip_Path();
            }
        } else {
            grid = 100 / grid;
            x = x * grid;
            y = y * grid;

            x = this.pix(x, "X");
            y = this.pix(y, "Y");

            this.pointArray[this.pointCount] = [x, y];
            this.pointCount += 1;
            this.drawPoint(x, y);

            if (this.pointArray.length >= 3) {
                this.toClip_Path();
            }
        }

    }
    update(x, y, point, grid) {

        if (grid != null) {
            grid = 100 / grid;
            x = x * grid;
            y = y * grid;
        }


        document.querySelectorAll("[data-point]")[point - 1].remove();
        this.pointArray[point - 1] = [this.pix(x, "X"), this.pix(y, "Y")];
        this.drawPoint(this.pix(x, "X"), this.pix(y, "Y"), point);
        if (this.pointArray.length >= 3) {
            this.toClip_Path();
        }
    }
    Precise_per(num, coord) {
        if (coord === "X") {
            return ((num / this.width) * 100);
        }
        if (coord == "Y") {
            return ((num / this.height) * 100);
        }
    }
    createCircle(dia, smooth) {
        for (let i = 0; i < 360; i += smooth) {
            let x = (dia / 2) * Math.sin(i) + (this.width / 2);
            let y = (dia / 2) * Math.cos(i) + (this.height / 2);

            this.manualPoint(this.Precise_per(x, "X") , this.Precise_per(y, "Y"));
        }
    }
}