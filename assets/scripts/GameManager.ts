import { _decorator, Component, Node, Collider2D, Sprite, EventTouch, find, Vec3, systemEvent, SystemEventType, Collider, ICollisionEvent, BoxCollider2D, PhysicsSystem2D, IPhysics2DContact, Contact2DType, random, randomRange, Label, RichText, UIOpacity } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) startGameNode: Node = null!;
    @property(Node) jumpTextNode: Node = null!;
    @property(Node) winScreenNode: Node = null!;
    @property(Node) loseScreenNode: Node = null!;
    @property(Node) finishLineNode: Node = null!;
    @property(Node) playerNode: Node = null!;
    @property(Node) tutorialCollision: Node = null!;
    @property(Node) obstacles: Node = null!;
    @property(Node) rewards: Node = null!;

    @property(RichText) moneyText: RichText = null;

    @property(Node) hearts: Node = null;

    public money: number = 0;

    @property(Player)
    public player: Player = null;

    public IsPaused: boolean = true;
    public IsEnd: boolean = false;

    public healthPoints: number = 3;


   // public gameState: 'START' | 'GAME' | 'TRAINING' | 'FINISH' | 'LOSE' = 'START';

    start() {
        //this.setState('START');
        systemEvent.on(SystemEventType.TOUCH_START, this.onStartTouch, this);
        systemEvent.on(SystemEventType.TOUCH_START, this.onTutorialTouch, this);


    }

   // private setState(state: 'START' | 'GAME' | 'TRAINING' | 'FINISH' | 'LOSE') {
    //    this.gameState = state;
    ///    switch (state) {
    //        case 'START':
    //            this.startGameNode.active = true;
    //            this.jumpTextNode.active = false;
    //            this.winScreenNode.active = false;
    //            this.loseScreenNode.active = false;
     //           break;
//
     ///       case 'GAME':
      //          this.startGameNode.active = false;
      //          this.jumpTextNode.active = false;
      //          this.winScreenNode.active = false;
       //         this.loseScreenNode.active = false;
      //          break;
      //
      //      case 'TRAINING':
      //          this.jumpTextNode.active = true;
      //          break;
      //
      //      case 'FINISH':
      //          this.winScreenNode.active = true;
       //         break;
//
          //  case 'LOSE':
      //          this.loseScreenNode.active = true;
       //         break;
      //  }
  //  }

    onStartTouch(event: EventTouch) {
        if (this.IsPaused && (this.IsEnd==false)) {
            this.IsPaused = false;
            this.jumpTextNode.active = false;
            this.startGameNode.active = false;

        }
        console.log("touched");
        }
        
      //  if (this.gameState === 'START') {
       //     this.setState('GAME');
      //  }
   // }

   // onTrainingTouch(event: EventTouch) {
     //   if (this.gameState === 'TRAINING') {
    //        this.setState('GAME');
    //    }
   // }

   onFinishTouch() {
        if (this.isCollision(this.playerNode, this.finishLineNode)) {
            this.IsPaused = true;
            this.IsEnd = true;
            this.winScreenNode.active = true;
            console.log("colided with finish")
        }
    }

    onPlayerCollideWithTutorial() {
        if (this.isCollision(this.playerNode, this.tutorialCollision)) {
            this.IsPaused = true;
            this.jumpTextNode.active = true;
            console.log("colided with tutorial")
        }
    }

    onTutorialTouch(event: EventTouch) {
        if (/*this.IsPaused && (this.IsEnd == false) && */this.isCollision(this.playerNode, this.tutorialCollision)) {
            this.tutorialCollision.active = false;
            this.IsPaused = false;
            this.jumpTextNode.active = false;
            this.startGameNode.active = false;
            console.log("tutrial touched");

        }
        //console.log("tutrial touched");
    }
    /*
    // Функция для проверки коллизии между двумя нодами
    isCollision(node1: Node, node2: Node): boolean {
        const collider1 = node1.getComponent(Collider2D);
        const collider2 = node2.getComponent(Collider2D);

        if (collider1 && collider2) {
            const worldPos1 = node1.position.clone();
            const worldPos2 = node2.position.clone();

            return collider1.worldAABB.intersects(collider2.worldAABB);
        }
        return false;
    }
    */

  
    isCollision(node1: Node, node2: Node): boolean {
        // Получаем коллайдеры для обеих нод
        const collider1 = node1.getComponent(Collider2D);
        const collider2 = node2.getComponent(Collider2D);

        // Проверяем, существуют ли коллайдеры для обеих нод
        if (!collider1 || !collider2) {
            return false; // Если хотя бы один из коллайдеров отсутствует, возвращаем false
        }

        // Проверяем пересечение коллайдеров
        const rect1 = collider1.worldAABB; // Прямоугольник, охватывающий первый коллайдер
        const rect2 = collider2.worldAABB; // Прямоугольник, охватывающий второй коллайдер

        // Проверка на пересечение прямоугольников
        const isIntersecting =
            rect1.x + rect1.width > rect2.x &&
            rect1.x < rect2.x + rect2.width &&
            rect1.y + rect1.height > rect2.y &&
            rect1.y < rect2.y + rect2.height;

        return isIntersecting;
    }
   
   /* onCollisionEnter(selfcolider, othercollider) {

    }
   */ 
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onStartTouch, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTutorialTouch, this);
        PhysicsSystem2D.instance.enable = true;

        // this.node.on(Node.EventType.TOUCH_START, this.onTrainingTouch, this);
       // var manager = Director.getCollisionManager();
    }



    update(deltaTime: number) {
        if (this.IsPaused == false) {
            //  this.onFinishTouch();
            this.onPlayerCollideWithTutorial();
           // console.log(this.isCollision(this.playerNode, this.tutorialCollision));
            this.onPlayerCollideWithObstacle();
            this.OnPlayerCollideWithRewars()
            this.onFinishTouch();
           // console.log("paused - false");
        }
        else {
           // console.log("paused - true")
           // console.log(this.IsEnd);
        }
        if (this.healthPoints == 0) {
            this.IsPaused = true;
            this.IsEnd = true;
            this.loseScreenNode.active = true;

        }
    }



    onPlayerCollideWithObstacle() {
        for (let i = 0; i < 9.; i++) {
            const obstacle = this.obstacles.getChildByName(`obstacle ${i}`);
        
        if (this.isCollision(this.playerNode, obstacle) && !this.player.isAnimationPlaying('damage')) {
            this.player.playerAnimation.play('damage') 
            console.log("colided with obstacle")
            if (!this.player.isAnimationPlaying('damage'))
                for (let k = 0; k < 3; k++) {
                    const heart = this.hearts.getChildByName(`heart ${k}`).getComponent(UIOpacity);
                    heart.opacity = 30;
                }
                this.healthPoints -= 1;
            }
        }

    }
    OnPlayerCollideWithRewars() {
        for (let j = 0; j < 26; j++) {
            const reward = this.rewards.getChildByName(`reward ${j}`);
                
            if (this.isCollision(this.playerNode, reward)) {
                this.money += Math.floor(randomRange(18, 65));
                this.moneyText.string = `$${this.money}`
                reward.setPosition(-100, -100);
                console.log("colided with reward")
            
            }
        }
    }
}
