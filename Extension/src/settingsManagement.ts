import * as vscode from 'vscode';
import * as path from 'path';
import { Func } from 'mocha';
import { TextEncoder } from 'util';
import { settings } from 'cluster';
import * as utils from "./utils";
import { debug } from 'console';


export function getLibraryPaths(context : vscode.ExtensionContext)
{
	var lifeboatConfig = vscode.workspace.getConfiguration("lifeboatapi.stormworks.libs", utils.getCurrentWorkspaceFile());

	var lbPaths : string[] = [];
	var lifeboatLibraryPaths : string[] = lifeboatConfig.get("projectSpecificLibraryPaths") ?? [];
    var wslifeboatLibraryPaths : string[] = lifeboatConfig.get("workspaceLibraryPaths") ?? [];
    var userlifeboatLibraryPaths : string[] = lifeboatConfig.get("globalLibraryPaths") ?? [];

	for (var path of lifeboatLibraryPaths)
    {
        lbPaths.push(utils.sanitisePath(path));
    }

    for (var path of wslifeboatLibraryPaths)
    {
        lbPaths.push(utils.sanitisePath(path));
    }

    for(var path of userlifeboatLibraryPaths)
    {
        lbPaths.push(utils.sanitisePath(path));
    }

	// add lifeboatAPI to the library path
	if(utils.isMicrocontrollerProject())
    {
		lbPaths.push(utils.sanitisePath(context.extensionPath) + "/assets/LifeBoatAPI/Microcontroller/");
        lbPaths.push(utils.sanitisePath(context.extensionPath) + "/assets/LifeBoatAPI/Tools/");
	}
	else
	{
		lbPaths.push(utils.sanitisePath(context.extensionPath) + "/assets/LifeBoatAPI/Addons/");
		lbPaths.push(utils.sanitisePath(context.extensionPath) + "/assets/LifeBoatAPI/Tools/");
	}

	return lbPaths;
}

export function getDebugPaths(context : vscode.ExtensionContext)
{
	var debugPaths = [
		utils.sanitisePath(context.extensionPath) + "/assets/luasocket/?.lua",
	];
	for(var path of getLibraryPaths(context))
	{
		debugPaths.push(path + "?.lua"); // irritating difference between how the debugger and the intellisense check paths
		debugPaths.push(path + "?.lbinternal"); // paths we want to be useable as lua, that we didn't want intellisense to see (ignore directories doesn't actually work)
	}
	return debugPaths;
}

export function getDebugCPaths(context : vscode.ExtensionContext)
{
	var luaDebugConfig = vscode.workspace.getConfiguration("lua.debug.settings");

	const defaultCPaths = [
		utils.sanitisePath(context.extensionPath) + "/assets/luasocket/dll/socket/core.dll",
		utils.sanitisePath(context.extensionPath) + "/assets/luasocket/dll/mime/core.dll"
	];

	var existing : string[] = luaDebugConfig.get("cpath") ?? [];
		
	for(const cPathElement of defaultCPaths)
	{
		if(existing.indexOf(cPathElement) === -1)
		{
			existing.push(cPathElement);
		}
	}
	return existing;
}


export function beginUpdateWorkspaceSettings(context: vscode.ExtensionContext) {
	var lifeboatConfig = vscode.workspace.getConfiguration("lifeboatapi.stormworks.libs", utils.getCurrentWorkspaceFile());
    var lifeboatLibraryPaths = getLibraryPaths(context);
	var lifeboatIgnorePaths : string[]= lifeboatConfig.get("ignorePaths") ?? [];

	// add standard ignores
	if (!lifeboatIgnorePaths.includes(".vscode"))
	{
		lifeboatIgnorePaths.push(".vscode");
	}

	if (!lifeboatIgnorePaths.includes("/out/"))
	{
		lifeboatIgnorePaths.push("/out/");
	}

	var luaDiagnosticsConfig = vscode.workspace.getConfiguration("Lua.diagnostics");
	var luaRuntimeConfig = vscode.workspace.getConfiguration("Lua.runtime");
	var luaLibWorkspace = vscode.workspace.getConfiguration("Lua.workspace");
	var luaDebugConfig = vscode.workspace.getConfiguration("lua.debug.settings");
	var luaIntellisense = vscode.workspace.getConfiguration("Lua.IntelliSense");

	return Promise.resolve()
	.then( () => {
		if(!utils.getCurrentWorkspaceFolder())
		{
			return Promise.reject("Can't update settings while no workspace is active");
		}

	}).then( () => {
		//Lua.diagnostics.disable
		var existing : string[] = luaLibWorkspace.get("disable") ?? [];
		if(existing.indexOf("lowercase-global") === -1)
		{
			existing.push("lowercase-global");
		}
		if(existing.indexOf("undefined-doc-name") === -1)
		{
			existing.push("undefined-doc-name");
		}
		return luaDiagnosticsConfig.update("disable", existing, vscode.ConfigurationTarget.Workspace);

	}).then( () => luaRuntimeConfig.update("version", "Lua 5.3", vscode.ConfigurationTarget.Workspace)
	
	).then( () => {
		//Lua.workspace.ignoreDir
		return luaLibWorkspace.update("ignoreDir", lifeboatIgnorePaths, vscode.ConfigurationTarget.Workspace);

	}).then(() => {
		// lua.debug.cpath
		return luaDebugConfig.update("cpath", getDebugCPaths(context), vscode.ConfigurationTarget.Workspace);

	}).then(() => {
		//lua.debug.path
		return luaDebugConfig.update("path", getDebugPaths(context), vscode.ConfigurationTarget.Workspace);
	}).then( () => { 
		//Lua.workspace.library
		var docConfig = vscode.workspace.getConfiguration("lifeboatapi.stormworks.nelo", utils.getCurrentWorkspaceFile());

		// Nelo Docs root
		var neloAddonDoc = utils.sanitisePath(context.extensionPath) + "/assets/nelodocs/docs_missions.lua";
		var neloMCDoc = utils.sanitisePath(context.extensionPath) + "/assets/nelodocs/docs_vehicles.lua";
		if(docConfig.get("overwriteNeloDocsPath") === true)
		{
			neloAddonDoc = docConfig.get("neloAddonDocPath") ?? neloAddonDoc; // if the user screws it up, just use our bundled one
			neloMCDoc = docConfig.get("neloMicrocontrollerDocPath") ?? neloMCDoc;
		}
		lifeboatLibraryPaths.push(neloAddonDoc);
		lifeboatLibraryPaths.push(neloMCDoc);

		return luaLibWorkspace.update("library", lifeboatLibraryPaths, vscode.ConfigurationTarget.Workspace);
	}).then( () => luaDebugConfig.update("luaVersion", "5.3", vscode.ConfigurationTarget.Workspace))
	.then( () => luaDebugConfig.update("luaArch", "x86", vscode.ConfigurationTarget.Workspace) )
	.then( () => luaIntellisense.update("traceBeSetted", true))
	.then( () => luaIntellisense.update("traceFieldInject", true))
	.then( () => luaIntellisense.update("traceLocalSet", true))
	.then( () => luaIntellisense.update("traceReturn", true));
}