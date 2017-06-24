import { autoSubscribeWithKey } from 'resub/dist/src/AutoSubscriptions';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { autoDeviceStorage } from "../extensions/storage/autoDeviceStorage";
import { FacebookPost } from '../server-access/facebook-access';
import { delay } from "./helpers";

export type PostItem = FacebookPost;

@AutoSubscribeStore
export abstract class PostsStoreBase extends StoreBase {

    private _error: string = null;
    private _isLoading = true;
    private _isLoaded = false;
    private _isLoadingMore = false;

    private _postsFiltered: PostItem[];
    private _postsActive: PostItem[];

    private _search: string;
    protected _postsActiveCount = 10;
    private _hasMorePosts = false;

    constructor() {
        super();
        setTimeout(this.load_super, 10);

        // Load Data Automatically on App Load
        setTimeout(this.loadData, 1000);
    }

    @autoSubscribe
    getPosts() {
        if (!this._postsActive) {
            this._postsActive = [];
            setTimeout(this.loadData);
        }

        return this._postsActive;
    }

    @autoSubscribe
    getError() {
        return this._error;
    }

    @autoSubscribe
    getIsLoading() {
        return this._isLoading;
    }

    @autoSubscribe
    getIsLoaded() {
        return this._isLoaded;
    }

    @autoSubscribeWithKey('_isLoadingMore')
    getIsLoadingMore() {
        return this._isLoadingMore;
    }

    @autoSubscribe
    getSearch() {
        return this._search;
    }

    @autoSubscribe
    getHasMorePosts() {
        return this._hasMorePosts;
    }

    setSearch = async (search: string) => {
        console.log('PostsStoreBase.setSearch', { search });
        if (search === this._search) { return; }

        this._search = search;
        this.resetData(true);
    };

    loadMorePosts = () => {
        setTimeout(this.loadMorePosts_inner);
    };

    private _isIgnoringLoadMore = false;

    private loadMorePosts_inner = async () => {
        console.log('PostsStoreBase.loadMorePosts');

        if (!this._isLoadingMore && !this._isIgnoringLoadMore && this._postsFiltered) {
            this._isIgnoringLoadMore = true;
            setTimeout(this.loadMorePosts_resume, 500);
            this._isLoadingMore = true;
            // this.trigger('_isLoadingMore');
            // await delay(1000);

            this._postsActiveCount += 10;
            this.showActivePosts();
        }
    };

    private loadMorePosts_resume = () => {
        this._isIgnoringLoadMore = false;
    };


    protected setError = (message: string, data?: any) => {
        console.error(message, data);
        this._error = message;

        if (data) {
            try {
                this._error = message + ': ' + JSON.stringify(data);
            } catch (err) {
                this._error = message + ': ' + data;
            }
        }

        this._isLoading = false;
        this._isLoaded = false;
        this._isLoadingMore = false;
        this.trigger();
    };

    private load_super = () => {
        this.load();
        this.resetData(true);
    };


    protected resetData = (shouldResetSearch = false) => {
        this._error = null;
        this._isLoading = true;
        this._isLoaded = false;
        this._isLoadingMore = false;

        if (shouldResetSearch) {
            this._postsFiltered = null;
            this._postsActiveCount = 10;
        }

        this._postsActive = null;
        this.trigger();
    };

    private loadData = async () => {

        if (!this._postsFiltered) {
            this._postsFiltered = await this.getPosts_filtered(this._search);
        }

        this.showActivePosts();
    }

    private showActivePosts = () => {

        const posts = this._postsFiltered;
        this._postsActive = posts.slice(0, this._postsActiveCount);
        this._hasMorePosts = this._postsActive.length !== posts.length;

        this._isLoaded = true;
        this._isLoading = false;
        this._isLoadingMore = false;
        this.trigger();
    };

    protected abstract load(): void;
    abstract getPosts_filtered(search: string): Promise<PostItem[]>;
}

