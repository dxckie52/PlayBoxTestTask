import { _decorator, Component, Node, Animation, systemEvent, SystemEventType, EventTouch, Collider, ICollisionEvent, Collider2D, Contact2DType, PhysicsSystem2D, IPhysics2DContact, lerp, RichText } from 'cc'
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('loseScreen')


export class loseScreen extends Component {

    @property(Node) installAndEarn: Node = null!;
    @property(Node) under: Node = null!;
    private rotationSpeed: number = 30;
    private scaleSpeed: number = 0.5;
    private increasing: boolean = true;
    @property(RichText) money = null!;

    @property(GameManager)
    public gameManager: GameManager = null;

    start() {

    }

    update(deltaTime: number) {

        this.money.string = `$${this.gameManager.money}`

        this.under.angle += this.rotationSpeed * deltaTime;

        const currentScale = this.installAndEarn.scale;

        if (this.increasing) {
            // Увеличиваем масштаб
            this.installAndEarn.setScale(currentScale.x + this.scaleSpeed * deltaTime, currentScale.y + this.scaleSpeed * deltaTime, currentScale.z);
            // Если объект достигает максимального масштаба, меняем флаг
            if (this.installAndEarn.scale.x > 1.5) { // Максимальный размер (можно настроить)
                this.increasing = false;
            }
        } else {
            // Уменьшаем масштаб
            this.installAndEarn.setScale(currentScale.x - this.scaleSpeed * deltaTime, currentScale.y - this.scaleSpeed * deltaTime, currentScale.z);
            // Если объект достигает минимального масштаба, меняем флаг
            if (this.installAndEarn.scale.x < 1) { // Минимальный размер (можно настроить)
                this.increasing = true;
            }
        }
    }
}

