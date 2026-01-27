import { _decorator, Component, Node, Collider2D, Sprite, EventTouch, find, Vec3, systemEvent, SystemEventType, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) startGameNode: Node = null!;
    @property(Node) jumpTextNode: Node = null!;
    @property(Node) winScreenNode: Node = null!;
    @property(Node) loseScreenNode: Node = null!;
    @property(Node) finishLineNode: Node = null!;
    @property(Node) playerNode: Node = null!;
    @property(Node) robberNode: Node = null!;
    

    public IsPaused: boolean = true;
    public IsEnd: boolean = false;




   // public gameState: 'START' | 'GAME' | 'TRAINING' | 'FINISH' | 'LOSE' = 'START';

    start() {
        //this.setState('START');
        systemEvent.on(SystemEventType.TOUCH_START, this.onStartTouch, this);
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
        }
    }

    onPlayerCollideWithRobber() {
        if (this.isCollision(this.playerNode, this.robberNode)) {
            this.IsPaused = true;
            this.jumpTextNode.active = true;
        }
    }

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

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onStartTouch, this);
       // this.node.on(Node.EventType.TOUCH_START, this.onTrainingTouch, this);
    }

    update(deltaTime: number) {
        if (this.IsPaused == false) {
            //  this.onFinishTouch();
            this.onPlayerCollideWithRobber();
           // console.log("paused - false");
        }
        else {
           // console.log("paused - true")
           // console.log(this.IsEnd);
    }
    }
}
