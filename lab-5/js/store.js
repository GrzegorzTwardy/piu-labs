class Store {
    #state = {
        shapes: [],
    };

    #subscribers = new Set();

    constructor() {
        const saved = localStorage.getItem('shapesState');
        if (saved) this.#state = JSON.parse(saved);
    }

    getState() {
        return { ...this.#state };
    }

    getCounts() {
        return {
            circles: this.#state.shapes.filter((s) => s.type === 'circle')
                .length,
            squares: this.#state.shapes.filter((s) => s.type === 'square')
                .length,
        };
    }

    addShape(shape) {
        this.#state.shapes.push(shape);
        this.#notify();
    }

    removeShape(id) {
        this.#state.shapes = this.#state.shapes.filter((s) => s.id !== id);
        this.#notify();
    }

    recolorShapeType(newColorFn, type) {
        this.#state.shapes = this.#state.shapes.map(s =>
            s.type === type ? { ...s, color: newColorFn() } : s
        );
        this.#notify();
    }

    subscribe(callback) {
        this.#subscribers.add(callback);
        callback(this.getState());
        return () => this.#subscribers.delete(callback);
    }

    #notify() {
        localStorage.setItem('shapesState', JSON.stringify(this.#state));
        for (const cb of this.#subscribers) cb(this.getState());
    }
}

export const store = new Store();
