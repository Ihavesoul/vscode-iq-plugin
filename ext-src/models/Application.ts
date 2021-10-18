/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { LoadSonatypeConfig, NEXUS_IQ_PUBLIC_APPLICATION_ID } from "../utils/Config";
import { LogLevel } from "../utils/Logger";
import { ComponentEntry } from "./ComponentEntry";
import { ComponentModelOptions } from "./ComponentModelOptions";
import { TreeableModel } from "./TreeableModel";

export class Application implements TreeableModel {

    public nexusIqApplicationId: string = 'TBC';
    public latestIqReportUrl: string = 'TBC';
    public coordsToComponent: Map<string, ComponentEntry> = new Map<
        string,
        ComponentEntry
    >();

    constructor(readonly name: string, readonly workspaceFolder: string, options: ComponentModelOptions) {
        const doc = LoadSonatypeConfig(this);

        if (doc && doc.iq) {
            this.nexusIqApplicationId = (doc.iq.PublicApplication ? doc.iq.PublicApplication : options.configuration.get(NEXUS_IQ_PUBLIC_APPLICATION_ID) as string);
        } else {
            options.logger.log(LogLevel.INFO, `Using VS Code User/Workspace Application ID for ${this.name} as no config to override it.`);
            this.nexusIqApplicationId = options.configuration.get(NEXUS_IQ_PUBLIC_APPLICATION_ID) as string;
        }
    }

    public getLabel(): string {
        return this.name
    }

    public hasChildren(): boolean {
        return true;
    }

    public getTooltip(): string {
        return `Application: ${this.name}\nNexus IQ ID: ${this.nexusIqApplicationId}\nLocation: ${this.workspaceFolder}`;
    }

    public iconName(): string {
        return `policy_badge.png`;
    }

    public setLatestIqReportUrl(url: string, iqServerUrl: string) {
        if (!url.startsWith(iqServerUrl)) {
            this.latestIqReportUrl = new URL(url, iqServerUrl).href;
        }
    }
}