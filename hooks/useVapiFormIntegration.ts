/**
 * Hook for managing real-time incremental VAPI data updates to CSAForm
 * Handles data mapping, merging, and debouncing of updates
 */

import { useCallback, useRef, useEffect } from "react";
import {
  mapVapiDataToNormalized,
  mergeIncrementalVapiData,
  validateVapiData,
  getDefinedFields,
  VapiRawData,
  NormalizedFormData,
} from "@/utils/vapiDataMapper";

interface UseVapiFormIntegrationOptions {
  /**
   * Debounce delay in milliseconds for batching updates
   * Default: 500ms - balances responsiveness with performance
   */
  debounceDelay?: number;

  /**
   * Callback when data is successfully mapped and ready for autofill
   * Called with normalized data ready for CSAForm
   */
  onAutofill?: (normalizedData: NormalizedFormData) => void;

  /**
   * Callback for validation errors
   */
  onValidationError?: (errors: string[]) => void;

  /**
   * Callback for non-critical warnings
   */
  onValidationWarning?: (warnings: string[]) => void;

  /**
   * Enable console logging for debugging
   * Default: false
   */
  debug?: boolean;

  /**
   * Validate data before autofill
   * Default: true
   */
  validateBeforeAutofill?: boolean;
}

/**
 * Hook for integrating VAPI real-time data into CSAForm
 * Manages incremental updates, debouncing, and validation
 */
export function useVapiFormIntegration(options: UseVapiFormIntegrationOptions = {}) {
  const {
    debounceDelay = 500,
    onAutofill,
    onValidationError,
    onValidationWarning,
    debug = false,
    validateBeforeAutofill = true,
  } = options;

  // Track accumulated data and debounce timer
  const accumulatedDataRef = useRef<Partial<VapiRawData>>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const normalizedDataRef = useRef<NormalizedFormData>({});

  /**
   * Processes and applies accumulated VAPI data to form
   */
  const processAccumulatedData = useCallback(() => {
    const definedFields = getDefinedFields(accumulatedDataRef.current);

    if (Object.keys(definedFields).length === 0) {
      if (debug) console.log("[VAPI Form] No new fields to process");
      return;
    }

    if (debug) {
      console.log("[VAPI Form] Processing accumulated data:", definedFields);
    }

    // Validate before processing
    if (validateBeforeAutofill) {
      const validation = validateVapiData(accumulatedDataRef.current);

      if (validation.errors.length > 0) {
        if (debug) console.error("[VAPI Form] Validation errors:", validation.errors);
        onValidationError?.(validation.errors);
        return;
      }

      if (validation.warnings.length > 0) {
        if (debug) console.warn("[VAPI Form] Validation warnings:", validation.warnings);
        onValidationWarning?.(validation.warnings);
      }
    }

    // Map and merge data
    const newNormalized = mergeIncrementalVapiData(
      normalizedDataRef.current,
      accumulatedDataRef.current
    );
    normalizedDataRef.current = newNormalized;

    if (debug) {
      console.log("[VAPI Form] Normalized data:", newNormalized);
    }

    // Call autofill callback
    onAutofill?.(newNormalized);

    // Reset accumulated data
    accumulatedDataRef.current = {};
  }, [debug, validateBeforeAutofill, onAutofill, onValidationError, onValidationWarning]);

  /**
   * Handles incremental VAPI data updates
   * Accumulates data and triggers debounced processing
   */
  const handleVapiDataUpdate = useCallback(
    (vapiData: Partial<VapiRawData>) => {
      // Accumulate incoming data
      accumulatedDataRef.current = {
        ...accumulatedDataRef.current,
        ...vapiData,
      };

      if (debug) {
        console.log("[VAPI Form] Data received:", vapiData);
        console.log("[VAPI Form] Accumulated data:", accumulatedDataRef.current);
      }

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced timer
      debounceTimerRef.current = setTimeout(() => {
        processAccumulatedData();
      }, debounceDelay);
    },
    [debounceDelay, processAccumulatedData, debug]
  );

  /**
   * Immediately process pending updates without waiting for debounce
   * Useful when user submits form
   */
  const flush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    processAccumulatedData();
  }, [processAccumulatedData]);

  /**
   * Get current normalized form data
   */
  const getNormalizedData = useCallback(() => {
    return normalizedDataRef.current;
  }, []);

  /**
   * Reset all accumulated data
   */
  const reset = useCallback(() => {
    accumulatedDataRef.current = {};
    normalizedDataRef.current = {};
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    handleVapiDataUpdate,
    flush,
    getNormalizedData,
    reset,
  };
}

/**
 * Hook for batch processing multiple VAPI updates
 * Useful when VAPI agent sends data in structured chunks
 */
export function useVapiBatchProcessor(options: UseVapiFormIntegrationOptions = {}) {
  const {
    onAutofill,
    onValidationError,
    onValidationWarning,
    debug = false,
    validateBeforeAutofill = true,
  } = options;

  const normalizedDataRef = useRef<NormalizedFormData>({});

  /**
   * Process complete VAPI data object at once
   * Can be called from VoiceIntake or other VAPI components
   */
  const processBatch = useCallback(
    (vapiData: Partial<VapiRawData> | Partial<VapiRawData>[]) => {
      const dataArray = Array.isArray(vapiData) ? vapiData : [vapiData];

      if (debug) {
        console.log("[VAPI Batch] Processing batch of", dataArray.length, "items");
      }

      for (const singleData of dataArray) {
        const definedFields = getDefinedFields(singleData);

        if (Object.keys(definedFields).length === 0) continue;

        // Validate if enabled
        if (validateBeforeAutofill) {
          const validation = validateVapiData(singleData);

          if (validation.errors.length > 0) {
            if (debug) console.error("[VAPI Batch] Validation errors:", validation.errors);
            onValidationError?.(validation.errors);
            continue;
          }

          if (validation.warnings.length > 0) {
            if (debug) console.warn("[VAPI Batch] Validation warnings:", validation.warnings);
            onValidationWarning?.(validation.warnings);
          }
        }

        // Merge and update
        const newNormalized = mergeIncrementalVapiData(
          normalizedDataRef.current,
          singleData
        );
        normalizedDataRef.current = newNormalized;

        if (debug) {
          console.log("[VAPI Batch] Updated normalized data:", newNormalized);
        }
      }

      // Call autofill after all items processed
      onAutofill?.(normalizedDataRef.current);
    },
    [debug, validateBeforeAutofill, onAutofill, onValidationError, onValidationWarning]
  );

  const getNormalizedData = useCallback(() => {
    return normalizedDataRef.current;
  }, []);

  const reset = useCallback(() => {
    normalizedDataRef.current = {};
  }, []);

  return {
    processBatch,
    getNormalizedData,
    reset,
  };
}
