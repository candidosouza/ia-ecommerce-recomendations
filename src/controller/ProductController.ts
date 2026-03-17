import type Events from '../events/events';
import type { ProductService } from '../service/ProductService';
import type { Product, User } from '../types';
import type { ProductView } from '../view/ProductView';

export class ProductController {
  #productView: ProductView;
  #currentUser: User | null = null;
  #events: typeof Events;
  #productService: ProductService;

  constructor({
    productView,
    events,
    productService
  }: {
    productView: ProductView;
    events: typeof Events;
    productService: ProductService;
  }) {
    this.#productView = productView;
    this.#productService = productService;
    this.#events = events;
    void this.init();
  }

  static init(deps: {
    productView: ProductView;
    events: typeof Events;
    productService: ProductService;
  }) {
    return new ProductController(deps);
  }

  private async init() {
    this.setupCallbacks();
    this.setupEventListeners();
    const products = await this.#productService.getProducts();
    this.#productView.render(products, true);
  }

  private setupEventListeners() {
    this.#events.onUserSelected((user) => {
      this.#currentUser = user;
      this.#productView.onUserSelected(user);
      this.#events.dispatchRecommend(user);
    });

    this.#events.onRecommendationsReady(({ recommendations }) => {
      this.#productView.render(recommendations, false);
    });
  }

  private setupCallbacks() {
    this.#productView.registerBuyProductCallback(this.handleBuyProduct.bind(this));
  }

  private async handleBuyProduct(product: Product) {
    if (!this.#currentUser) return;
    this.#events.dispatchPurchaseAdded({ user: this.#currentUser, product });
  }
}
