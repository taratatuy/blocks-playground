function init() {
  document.body.addEventListener('mousedown', bodyResizeListener);
  document.body.addEventListener('mousedown', bodyMoveListener);
}

/*
 * Обработчик для перетаскивания элемента.
 */
function bodyMoveListener(e) {
  if (e.target.classList[0] === 'square') {
    // Prevent default element drag.
    e.target.ondragstart = () => {
      return false;
    };

    const currentSquare = e.target;
    currentSquare.classList.add('grabbing');

    const startPositon = {
      x: e.clientX,
      y: e.clientY,
    };

    // Вычисляем на сколько элемент уже смещен отностительно начальной позиции.
    const styles = getComputedStyle(currentSquare);
    let h = 0;
    let w = 0;
    if (styles.transform != 'none') {
      w = +styles.transform.match(/-?\d+/g)[4];
      h = +styles.transform.match(/-?\d+/g)[5];
    }

    // Выводим элементы на первый план. Уменьшаем у каждого элемента на 1 вплоть до 0.
    document.querySelectorAll('.square').forEach((square) => {
      square.style.zIndex =
        square.style.zIndex > 0 ? square.style.zIndex - 1 : 0;
    });
    currentSquare.style.zIndex = 25;

    // Обработчик для перемещения мышки с зажатой ЛКМ.
    const onMove = (e) => {
      const shiftX = e.clientX - startPositon.x;
      const shiftY = e.clientY - startPositon.y;

      currentSquare.style.transform = `translate(${w + shiftX}px, ${
        h + shiftY
      }px)`;
    };

    // После перетаскивания отписываемся от всех листенеров.
    const stopMoving = () => {
      currentSquare.classList.remove('grabbing');
      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseup', stopMoving);
      document.body.removeEventListener('mouseleave', stopMoving);
    };

    // Листенер для перемещения мышки с зажатой ЛКМ.
    document.body.addEventListener('mousemove', onMove);

    // Листенеры для окончания перемещения.
    document.body.addEventListener('mouseup', stopMoving);
    document.body.addEventListener('mouseleave', stopMoving);
  }
}

/*
 * Обработчик для изменения размера элемента.
 */
function bodyResizeListener(e) {
  if (e.target.dataset.border == 'true') {
    // Prevent default element drag.
    e.target.ondragstart = () => {
      return false;
    };

    const currentSquare = e.target.parentElement;
    const currentBorder = e.target;
    const startPositon = {
      x: e.clientX,
      y: e.clientY,
    };
    const startSize = {
      height: currentSquare.offsetHeight,
      width: currentSquare.offsetWidth,
    };

    // Свитч объект с фунециями для обработки разных сторон.
    const switchObj = {
      'square__left-border': (e) => {
        const shift = e.clientX - startPositon.x;
        currentSquare.style.width = `${startSize.width + shift}px`;
      },

      'square__bot-border': (e) => {
        const shift = e.clientY - startPositon.y;
        currentSquare.style.height = `${startSize.height + shift}px`;
      },

      square__corner: (e) => {
        switchObj['square__left-border'](e);
        switchObj['square__bot-border'](e);
      },
    };

    // Обработчик для перемещения мышки с зажатой ЛКМ.
    // Вызывает свою функцию по классу элемента.
    const onMove = (e) => {
      switchObj[currentBorder.classList[0]](e);
    };

    // Прсле отжима кнопки убераем всем смещение и отписываемся от всего.
    const stopResizing = () => {
      document.querySelectorAll('.square').forEach((square) => {
        square.style.transform = 'unset';
      });

      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseup', stopResizing);
      document.body.removeEventListener('mouseleave', stopResizing);
    };

    // Листенер для перемещения мышки с зажатой ЛКМ.
    document.body.addEventListener('mousemove', onMove);

    // Листенеры для окончания изменения размера.
    document.body.addEventListener('mouseup', stopResizing);
    document.body.addEventListener('mouseleave', stopResizing);
  }
}

init();
