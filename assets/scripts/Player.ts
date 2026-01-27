import { _decorator, Component, Node, Animation, systemEvent, SystemEventType, EventTouch } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node)
    public map: Node = null!; // Ссылка на карту, которую будем двигать

    @property(Animation)
    public playerAnimation: Animation = null!; // Анимации персонажа

    @property(Number)
    public moveSpeed: number = 100; // Скорость движения карты

    @property(Number)
    public jumpHeight: number = 250; // Высота прыжка

    @property(Number)
    public jumpSpeed: number = 500; // Скорость подъема (чем выше, тем быстрее)

    @property(Number)
    public fallSpeedMultiplier: number = 1.5; // Множитель для скорости падения (чтобы падение было быстрее)

    private isJumping: boolean = false; // Статус прыжка
    private isFalling: boolean = false; // Статус падения
    private jumpStartY: number = 0; // Начальная высота при прыжке
    private currentJumpTime: number = 0; // Время подъема для плавного движения
    //private isMoving: boolean = false;

    @property(GameManager)
    public gameManager: GameManager = null;


    start() {
        // Подписка на события для прыжка
        systemEvent.on(SystemEventType.TOUCH_START, this.onJump, this);
    }

    update(dt: number) {
        if (this.gameManager) {
            console.log("gameManager найден: ", this.gameManager); // Для отладки
            if (this.gameManager.IsPaused == false) {
                // Двигаем карту влево для создания иллюзии движения
                this.map.setPosition(this.map.position.x - this.moveSpeed * dt, this.map.position.y, this.map.position.z);
            }
        }
        else {
            console.error("Компонент GameManager не прикреплен к узлу или IsPaused равно true");
        }

        if (!this.isJumping) {
            // Если персонаж не в прыжке, включаем анимацию "run"
            if (!this.isAnimationPlaying('run')) {
                this.playerAnimation.play('run');
            }
        } else {
            // Если игрок в прыжке, меняем анимацию на "jump"
            if (!this.isAnimationPlaying('jump')) {
                this.playerAnimation.play('jump');
            }

            // Логика подъема (плавное поднятие)
            if (!this.isFalling) {
                if (this.node.position.y < this.jumpStartY + this.jumpHeight) {
                    // Плавный подъем
                    this.node.setPosition(this.node.position.x, this.node.position.y + this.jumpSpeed * dt, this.node.position.z);
                } else {
                    // Персонаж достиг высоты прыжка, начинается падение
                    this.isFalling = true;
                }
            }

            // Логика падения
            if (this.isFalling) {
                this.node.setPosition(this.node.position.x, this.node.position.y - this.jumpSpeed * this.fallSpeedMultiplier * dt, this.node.position.z);

                // Когда персонаж приземляется
                if (this.node.position.y <= this.jumpStartY) {
                    this.node.setPosition(this.node.position.x, this.jumpStartY, this.node.position.z);
                    this.isJumping = false;
                    this.isFalling = false;
                    // После приземления, включаем анимацию "run"
                    this.playerAnimation.play('run');
                }
            }
        }
    }

    // Проверка, воспроизводится ли анимация
    private isAnimationPlaying(name: string): boolean {
        const state = this.playerAnimation.getState(name);
        return state && state.isPlaying;
    }

    // Обработчик прыжка
    private onJump(event: EventTouch) {
        if (!this.isJumping) {
            this.isJumping = true;
            this.isFalling = false; // Убираем падение, когда начинается новый прыжок
            this.jumpStartY = this.node.position.y;
            this.currentJumpTime = 0; // Сброс времени для плавного подъема
        }
    }
}
