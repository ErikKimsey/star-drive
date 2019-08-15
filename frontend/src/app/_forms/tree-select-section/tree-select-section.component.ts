import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { Category } from '../../_models/category';

@Component({
  selector: 'app-tree-select-section',
  templateUrl: './tree-select-section.component.html',
  styleUrls: ['./tree-select-section.component.scss']
})
export class TreeSelectSectionComponent extends FieldType implements OnInit {
  treeControl = new NestedTreeControl<Category>(node => node.children);

  hasNoContent = (_: number, _nodeData: Category) => _nodeData.name === '';

  /** The selection for checklist */
  categories = new SelectionModel<Category>(true /* multiple */);

  ngOnInit() {
    for (let cat in this.to.startingCategories) {
      this.categories.isSelected(this.to.startingCategories[cat]);
    }
    console.log('categories after single select?', this.categories);
  }

  hasNestedChild = (_: number, node: Category) => {
    return (node.children && (node.children.length > 0));
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: Category): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.categories.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: Category): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.categories.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  numSelectedDescendants(node: Category): number {
    const descendants: Category[] = this.treeControl.getDescendants(node);
    const selectedDescendants = descendants.filter(d => this.categories.isSelected(d));
    return selectedDescendants.length;
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  toggleNode(node: Category, checked: boolean): void {
    this.categories.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.categories.isSelected(node)
      ? this.categories.select(...descendants)
      : this.categories.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.categories.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    console.log('categories in toggle', this.categories.selected);
    // if (this.to.type === 'tree-select') {
    //   console.log('i am an array');
    console.log('tree control', this.treeControl);
    for (let cat in this.to.dataSource) {
      console.log('this is the form control value', this.to.dataSource[cat]);
      this.formControl.patchValue(this.to.dataSource[cat] in this.categories.selected
        ? [...(this.formControl.value || []), node]
        : [...(this.formControl.value || [])].filter(o => o !== node),
      );
    }

    // for (let cat in this.categories.selected) {
    //   // console.log('this is the cat in the form control set', this.categories.selected[cat]);
    //   this.formControl.patchValue((this.formControl.value || []), this.categories.selected[cat]);
    // }


      // this.formControl.patchValue(checked
      //   ? [...(this.formControl.value || []), node]
      //   : [...(this.formControl.value || [])].filter(o => o !== node),
      // );
      // for (const child in node.children) {
      //   console.log('here is the child', child);
      //   this.formControl.patchValue(checked
      //   ? [...(this.formControl.value || []), node.children[child]]
      //   : [...(this.formControl.value || [])].filter(o => o !== node.children[child]),
      // );
      // }
    // } else {
    //   console.log('i am not an array');
    //   this.formControl.patchValue({ ...this.formControl.value, [node.name]: checked });
    // }
    this.formControl.markAsTouched();
    console.log('here is the form control', this.formControl);
  }


  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: Category): void {
    let parent: Category | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

    /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: Category): void {
    const nodeSelected = this.categories.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.categories.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.categories.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.categories.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: Category): Category | null {
    return node.parent;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: Category) {
    // node.children.push({'name': '', 'parent': node, 'children': [], 'level': node.level+1});
    this.treeControl.expand(node);
  }
}
