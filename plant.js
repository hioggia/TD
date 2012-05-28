function BasePlantView(opts){
    var div = document.createElement("div");
    div.style.cssText = "width:32px;height:48px;background:url('./"+opts.name+".png')";
    //div.style.outline = "solid 1px blue";
    div.style.position = "absolute";

    div.style.zIndex = "3";
    div.style.pointerEvents = "none";
    
    var hp = document.createElement("div");
    hp.style.height = "3px";
    hp.style.width = "32px";
    hp.style.position = "absolute";
    hp.style.background = "green";
	this.hpDiv = hp;
    div.appendChild(hp);
    
    function moving(){
        var t = Date.now() - begin;
        var pos = Math.round(t/250%4);
        div.style.backgroundPositionX = pos*32+'px';
		
    }
    var begin;
    this.startMoving = function(){
        begin = Date.now();
        timer.addTimerProc(moving);
    }
    this.stopMoving = function(){
        timer.removeTimerProc(moving);
        div.style.backgroundPositionX = "0px"
    }	
	
    var direction = {
        "-1,0":1,
        "1,0":2,
        "0,1":0,
        "0,-1":3
    }
	
	
    this.hurt = function(v,maxhp) {
        hp.style.width = v/maxhp*32 +"px"
    }
    this.setDirection = function(dx,dy) {
        var d = 0;
        if(dx<0) d =3; 
        else if(dx>0) d =2;
        else if(dy<0) d =1;
        else if(dy>0) d =0;
        //console.log([dx,dy]);
        //console.log(d)
        div.style.backgroundPositionY = 48 * d +"px";
    }
    var position = [0,0];
    this.setPosition = function(x,y) {
        position = [x,y];
        div.style.top = y+size - 48 + "px";
        div.style.left = x+size/2 - 16  + "px";
        div.style.zIndex = 10000+y;
    }
    this.getPosition = function() {
        return {x:position[0],y:position[1]};
    }
    this.element = div;
}




function BasePlant(opts){
    WorldObject.call(this);
	
	this.name = opts.name;
	this.attack = opts.attack;
	this.range = opts.range;
	
    this.view = new BasePlantView(opts);
    var cooldown = 0;

    this.hp = opts.hp;
    this.hurt = function(damage){
        this.hp -= damage;
        this.view.hurt(this.hp,opts.hp);
		if (this.name == 'nut'&& this.hp <=200){
			this.range = 3;
			this.view.hpDiv.style.background = "red";
			
		}
		
		if (this.name == 'eggplant'&& this.hp <=50){
			this.attack = 15;
			this.view.hpDiv.style.background = "black";
			
		}
        if(this.hp<=0){
			 this.world.removeItem(this);
			 PlantFactory.diePlant[this.name]++;
			 PlantFactory.nextWave();
		}
		 
    }

        
    this.move = function(dx,dy){
        return this.world.moveItem(this,dx,dy,10);
    }
    
    this.time = function(time){
        //console.log(time);
        if(cooldown) return cooldown--; 
		var index = 0;
		var x = parseInt(this.view.getPosition().x/size);
		var y = parseInt(this.view.getPosition().y/size);
		 
		
		/** 怪物攻击 start **/
		var towers = this.world.getItemsInRange(this,this.range).filter(function(e){ return (e instanceof Tower) })
		if (towers.length!=0){
			var tower = towers[parseInt(Math.random()*towers.length)];
			tower.hurt(this.attack);
		}

		/** 怪物攻击 end **/
		
		/** 怪物行走 start **/
		var percent = Math.abs(x-world.centerPos.x)/(Math.abs(x-world.centerPos.x)+Math.abs(y-world.centerPos.y));
		if (Math.random()+ percent>=1){
			if (x>world.centerPos.x){
				index = 2;
			}else if(x<world.centerPos.x){
				index = 3;
			}else{
				if (y>world.centerPos.y){
					index= 0;
				}else if (y<world.centerPos.y){
					index= 1;	
				}
			}
		}else{
			if (y>world.centerPos.y){
				index= 0;
			}else if (y<world.centerPos.y){
				index= 1;
			}else{
				if (x>world.centerPos.x){
					index = 2;
				}else if(x<world.centerPos.x){
					index = 3;
				}
			}
		}
		/** 怪物行走 end **/
		
		
        if(this.move.apply(this,[[0,-1],[0,1],[-1,0],[1,0]][index]))
            cooldown = 5;
    }
}








