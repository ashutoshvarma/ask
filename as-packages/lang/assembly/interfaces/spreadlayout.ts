import { IKey } from "./key";

export interface SpreadLayout {
    /// The footprint of the type.
    ///
    /// This is the number of adjunctive cells the type requires in order to
    /// be stored in the contract storage with spread layout.
    ///
    /// # Examples
    ///
    /// An instance of type `i32` requires one storage cell, so its footprint is 1.
    /// An instance of type `(i32, i32)` requires 2 storage cells since a
    /// tuple or any other combined data structure always associates disjunctive
    /// cells for its sub types. The same applies to arrays, e.g. `[i32; 5]`
    /// has a footprint of 5.
    FOOTPRINT(): u64;

    /// Indicates whether a type requires deep clean-up of its state meaning that
    /// a clean-up routine has to decode an entity into an instance in order to
    /// eventually recurse upon its tear-down.
    /// This is not required for the majority of primitive data types such as `i32`,
    /// however types such as `storage::Box` that might want to forward the clean-up
    /// procedure to their inner `T` require a deep clean-up.
    ///
    /// # Note
    ///
    /// The default is set to `true` in order to have correctness by default since
    /// no type invariants break if a deep clean-up is performed on a type that does
    /// not need it but performing a shallow clean-up for a type that requires a
    /// deep clean-up would break invariants.
    /// This is solely a setting to improve performance upon clean-up for some types.
    REQUIRES_DEEP_CLEAN_UP(): bool;
    /**
     * Pulls an instance of `this` from the contract storage.
     * The pointer denotes the position where the instance is being pulled
     * from within the contract storage
     *
     * # Note
     * This method of pulling is depth-first: Sub-types are pulled first and
     * construct the super-type through this procedure.
     *
     * @param key
     */
    pullSpread<K extends IKey>(key: K): void;

    /**
     * Pushes an instance of `this` to the contract storage.
     *
     * - Tries to spread `this` to as many storage cells as possible.
     * - The key denotes the position where the instance is being pushed to the contract storage.
     *
     * # Note
     * This method of pushing is depth-first: Sub-types are pushed before their parent or super type.
     *
     * @param key
     */
    pushSpread<K extends IKey>(key: K): void;

    /**
     * Clears an instance of `this` from the contract storage.
     *
     * Tries to clean `this` from contract storage as if `this` was stored in it using spread layout.
     * The key denotes the position where the instance is being cleared from the contract storage.
     *
     * # Note
     * This method of clearing is depth-first: Sub-types are cleared before their parent or super type.
     * @param key
     */
    clearSpread<K extends IKey>(key: K): void;
}
