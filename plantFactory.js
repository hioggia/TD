var PlantFactory = {
	missionNum:1,
	waveNum:0,
	diePlant:{
		eggplant:0,
		nut:0
	},
	diePlantNum:0,
	plantConfig:{
		eggplant:{
			name:'eggplant',
			attack:10,
			hp:100,
			range:1
		},
		nut:{
			name:'nut',
			attack:9,
			hp:500,
			range:1
		}
	},
	// 不刷怪半径
	radius:4,
	
	/**
	 * 生成每一波的敌人
	 */
	createPlantsByWave:function (){
		waveNum = this.waveNum;
		var waveData = data['mission'+this.missionNum].waves[waveNum];
		for (var key in waveData){
			for (var i = 0 ;i<waveData[key];i++){
				this.createPlant(key);
			}
		}
	},

	startChallenge:function (){
		this.missionNum = 0;
	},
	
	createPlant:function (plantName){
		while(1){
			var x,y;
			var randomNum = Math.random();
			var lowerLimit_x = world.mapMetaData.right-world.mapMetaData.left - world.centerPos.x+this.radius;
			var lowerLimit_y = world.mapMetaData.bottom-world.mapMetaData.top - world.centerPos.y+this.radius;
			if (randomNum<0.25){
				x = parseInt(Math.random()*(world.centerPos.x-this.radius));
				y = parseInt(Math.random()*(world.centerPos.y-this.radius));
			}else if (randomNum>0.25 && randomNum<0.5){
				x = parseInt(Math.random()*(world.mapMetaData.right-world.mapMetaData.left-lowerLimit_x+1)+lowerLimit_x);
				y = parseInt(Math.random()*(world.mapMetaData.bottom-world.mapMetaData.top-lowerLimit_y+1)+lowerLimit_y);
			}else if (randomNum>0.5 && randomNum<0.75 ){
				x = parseInt(Math.random()*(world.centerPos.x-this.radius));
				y = parseInt(Math.random()*(world.mapMetaData.bottom-world.mapMetaData.top-lowerLimit_y+1)+lowerLimit_y);
			}else{
				x = parseInt(Math.random()*(world.mapMetaData.right-world.mapMetaData.left-lowerLimit_x+1)+lowerLimit_x);
				y = parseInt(Math.random()*(world.centerPos.y-this.radius));
			}
			if(!world.map[x+","+y]){
				var plant = new BasePlant(this.plantConfig[plantName]);
				plant.view.startMoving();
				world.addItem(plant,x,y);
				break;
			}
		}
	},
	
	nextMission:function(){
		this.missionNum ++;
		this.waveNum = 0;
		this.createPlantsByWave();
	},
	
	nextWave:function(){
		var waveData = data['mission'+this.missionNum].waves[PlantFactory.waveNum];

		 for(var key in world.map){
		 	if(world.map[key] instanceof BasePlant){
		 		return;
		 	}
		 }

		 this.waveNum++;
		 if (this.waveNum>data['mission'+this.missionNum].waves.length-1){
			showH(this.nextMission.bind(this));
		 }else{
			this.createPlantsByWave(); 
		 }
	}
}