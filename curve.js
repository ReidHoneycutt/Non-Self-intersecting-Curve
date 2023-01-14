class Curve {
    constructor(seg_len, max_segs, P0) {
        this.seg_len = seg_len;
        this.max_segs = max_segs;
        this.path = [P0];
        this.rmv = 1;
        this.cons_segs = 0;
        this.total_calls = 0;
        this.recalls = 0;
        this.ratio = 0;
        this.coverage = 0;
    }
    add_seg(P) {
      if (this.path.length < this.max_segs) {
          this.path.push(P);
      }
      else {
        return;
      }
    }
    remove_seg() {
      this.path.pop();
    }
    find_new_seg1() {
      l = this.path.length;
      let i = 0;
      while ((this.path.length == l) && (i < this.path.length-3)) {
        if (Math.sqrt(Math.pow(this.path[this.path.length-1].x-this.path[i].x, 2)+Math.pow(this.path[this.path.length-1].y-this.path[i].y, 2)) < r/2) {
          this.remove_seg(); 
        }
        i++;
      } 
      add_seg(createVector(this.path[this.path.length-1].x+r, this.path[this.path-1].y));
      this.find_new_seg1();
      add_seg(createVector(this.path[this.path.length-1].x-r, this.path[this.path-1].y));
      add_seg(createVector(this.path[this.path.length-1].x, this.path[this.path-1].y+r));
      add_seg(createVector(this.path[this.path.length-1].x, this.path[this.path-1].y-r));
    }
    find_new_seg2() {
        this.total_calls += 1;
        let candidates = [];
        let P = createVector(this.path[this.path.length-1].x, this.path[this.path.length-1].y);
        candidates[0] = createVector(P.x+this.seg_len, P.y);
        candidates[1] = createVector(P.x-this.seg_len, P.y);
        candidates[2] = createVector(P.x, P.y+this.seg_len);
        candidates[3] = createVector(P.x, P.y-this.seg_len);

        let choices = [];
    
        for (let i = 0; i < 4; i++) {
            let eq = 0;
            for (let j = 0; j < this.path.length; j++) {
                if (candidates[i].x == this.path[j].x && candidates[i].y == this.path[j].y) {
                    eq += 1;
                }
            }
            if (eq == 0 && !this.at_wall(candidates[i])) {
                choices.push(candidates[i])
            }
        } 

        let val;
        if (choices.length > 0) {
            this.cons_segs++;
            let coeff = Math.pow(2, Math.sqrt(Math.log(this.total_calls, 1000)))
            if (this.cons_segs > coeff*this.ratio) {
                this.rmv = 1;
            }
            if (choices.length == 1) {
                val = 0;
                this.add_seg(choices[val])
            } else if (choices.length == 2) {
                val = Math.floor(random(0, 2));
                this.add_seg(choices[val])
            } else if (choices.length == 3) {
                val = Math.floor(random(0, 3));
                this.add_seg(choices[val])
            } else if (choices.length == 4) {
                val = Math.floor(random(0, 4));
                this.add_seg(choices[val])
            }
        } else {
            this.recalls += 1;
            this.cons_segs = 0;
            this.rmv++;
            for (let i = 0; i < this.rmv; i++) {
                this.remove_seg()
            }
            this.show()
            this.find_new_seg2();
        }
        this.ratio = round(100 * this.recalls/this.total_calls, 3);
        this.coverage = round((100 * PATH_WIDTH * this.path.length * this.seg_len) / AREA, 3);
    }
    at_wall(V) {
        if (V.x < 0 || V.x >= W) {
            return true;
        } else if (V.y < 0 || V.y >= H) {
            return true;
        } else {
            return false;
        }
    }
    display_text() {
        noStroke();
        strokeWeight(20);
        let size = Math.sqrt(max(W, H))/2;
        textSize(size)
        fill(this.path.length, 0, 1);
        text("REROUTE : ", 5*size, H/10)
        text(this.ratio, 11*size, H/10)
        text("%", 14*size, H/10)
        text("COVERAGE : ", 4.2*size, H/8)
        text(this.coverage, 11*size, H/8)
        text("%", 14*size, H/8)
        //text("%", W/4.125, H/10)
    }
    show() {
        background(0);
        this.display_text();
        strokeWeight(PATH_WIDTH);
        
        colorMode(HSB, this.path.length, 1, 1);
        for (let i = 0; i < this.path.length-1; i++) {
            stroke(i, 1, 1)
            line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);
        }
    }
}
