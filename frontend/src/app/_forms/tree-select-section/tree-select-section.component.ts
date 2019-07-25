import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { FieldType } from '@ngx-formly/material';
import { Category } from '../../_models/category';

@Component({
  selector: 'app-tree-select-section',
  templateUrl: './tree-select-section.component.html',
  styleUrls: ['./tree-select-section.component.scss']
})
export class TreeSelectSectionComponent extends FieldType implements OnInit {
  treeControl = new NestedTreeControl<Category>(node => observableOf(node.children));

  nodes = {};

  /** The selection for checklist */
  checklistSelection = new SelectionModel<Category>(true /* multiple */);

  ngOnInit() {
  }

  hasNestedChild = (_: number, node: Category) => {
    return (node.children && (node.children.length > 0));
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: Category): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: Category): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  numSelectedDescendants(node: Category): number {
    const descendants: Category[] = this.treeControl.getDescendants(node);
    const selectedDescendants = descendants.filter(d => this.checklistSelection.isSelected(d));
    return selectedDescendants.length;
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  toggleNode(node: Category): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  toggleExpand($event, node: Category): void {
    $event.preventDefault();
}
}
