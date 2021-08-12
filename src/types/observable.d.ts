type WatcherExpression<T> = () => T;

type WatcherCallback<T> = (newValue: T, oldValue: T) => void;
