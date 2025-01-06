import type { TypedFlatConfigItem } from "../../types";
import interopDefault from "../../utils/interop-default";

const reactRefresh = async ({ hasVite }: { hasVite: boolean }): Promise<TypedFlatConfigItem[]> => {
    const reactRefreshPlugin = await interopDefault(import("eslint-plugin-react-refresh"));

    return [
        hasVite ? reactRefreshPlugin.configs.vite : reactRefreshPlugin.configs.recommended,
    ];
};

export default reactRefresh;
